var _ = require('lodash');
var pretty = require('./prettyprint').pretty;
var Vampire = Parse.Object.extend("Vampire");
var Image = require("jimp");

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

var create_thumbnail = function(portrait, input_image, size) {
    return input_image.data().then(function (data) {
        var image = new Image;
        return image.setData(data);
    }).then(function(image) {
        return image.scale({
            width: size,
            height: size
        });
    }).then(function(image) {
        return image.setFormat("JPEG");
    }).then(function(image) {
        return image.data();
    }).then(function(buffer) {
        var base64 = buffer.toString("base64");
        var cropped = new Parse.File("thumbnail_" + size + ".jpg", { base64: base64 });
        return cropped.save();
    }).then(function(cropped) {
        portrait.set("thumb_" + size, cropped);
    });
}

var crop_and_thumb = function(request, response) {
    var portrait = request.object;
    var THUMBNAIL_SIZES = [32, 64,128, 256];
    var needed_sizes = [];

    if (portrait.dirty("original")) {
        _.each(THUMBNAIL_SIZES, function (size) {
            portrait.set("thumb_" + size, undefined);
        });
    }

    _.each(THUMBNAIL_SIZES, function (size) {
        if (!portrait.get("thumb_" + size)) {
            needed_sizes.push(size);
        }
    })

    if (0 == needed_sizes.length) {
        response.success();
        return;
    }

    Parse.Cloud.httpRequest({
        url: portrait.get("original").url()
    }).then(function(response) {
        var image = new Image();
        return image.setData(response.buffer);
    }).then(function(image) {
        // Crop the image to the smaller of width or height.
        var size = Math.min(image.width(), image.height());
        return image.crop({
            left: (image.width() - size) / 2,
            top: (image.height() - size) / 2,
            width: size,
            height: size
        });
    }).then(function(image) {
        var promises = [];
        _.each(THUMBNAIL_SIZES, function(size) {
            promises.push(create_thumbnail(portrait, image, size))
        })
        return Parse.Promise.when(promises);
    }).then(function() {
        response.success();
    }, function(error) {
        response.error(error);
    });
};

Parse.Cloud.beforeSave("TroupePortrait", function(request, response) {
    crop_and_thumb(request, response);
});

Parse.Cloud.beforeSave("CharacterPortrait", function(request, response) {
    var portrait = request.object;
    var THUMBNAIL_SIZES = [32, 64,128, 256];
    var needed_sizes = [];

    if (portrait.dirty("original")) {
        _.each(THUMBNAIL_SIZES, function (size) {
            portrait.set("thumb_" + size, undefined);
        });
    }

    _.each(THUMBNAIL_SIZES, function (size) {
        if (!portrait.get("thumb_" + size)) {
            needed_sizes.push(size);
        }
    })

    if (0 == needed_sizes.length) {
        response.success();
        return;
    }

    Parse.Cloud.httpRequest({
        url: portrait.get("original").url()
    }).then(function(response) {
        var image = new Image();
        return image.setData(response.buffer);
    }).then(function(image) {
        // Crop the image to the smaller of width or height.
        var size = Math.min(image.width(), image.height());
        return image.crop({
            left: (image.width() - size) / 2,
            top: (image.height() - size) / 2,
            width: size,
            height: size
        });
    }).then(function(image) {
        var promises = [];
        _.each(THUMBNAIL_SIZES, function(size) {
            promises.push(create_thumbnail(portrait, image, size))
        })
        return Parse.Promise.when(promises);
    }).then(function() {
        response.success();
    }, function(error) {
        response.error(error);
    });
});

var get_vampire_change_acl = function(vampire) {
    var daString = vampire.get("acl_to_json");
    if (_.isUndefined(daString)) {
        var acl = new Parse.ACL;
        acl.setPublicReadAccess(false);
        acl.setPublicWriteAccess(false);
        var owner = vampire.get("owner");
        if (!_.isUndefined(owner)) {
            // Archived characters have no owner
            acl.setReadAccess(owner, true);
            acl.setWriteAccess(owner, false);
        }
        acl.setRoleReadAccess("Administrator", true);
        acl.setRoleWriteAccess("Administrator", true);
        return acl;
    }
    var acl = new Parse.ACL;
    var given_permissions_by_id = JSON.parse(daString);
    _.each(given_permissions_by_id, function (permissions, key) {
        acl.setReadAccess(key, true);
        acl.setWriteAccess(key, false);
    });
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess("Administrator", true);
    acl.setRoleWriteAccess("Administrator", false);
    return acl;
}

Parse.Cloud.beforeSave("Vampire", function(request, response) {
    var tracked_texts = ["clan", "state", "archetype", "faction", "title", "sect", "antecedence"];
    var v = request.object;
    var desired_changes = _.intersection(tracked_texts, v.dirtyKeys());
    if (0 === desired_changes.length) {
        console.log("Saving vampire (" + v.id + ") and there are no changes we track here");
        response.success();
        return;
    }
    // TODO: Update the history permissions if troupes has changed
    var new_values = {};
    _.each(v.dirtyKeys(), function(k) {
        new_values[k] = v.get(k);
    })
    var vToFetch = new Vampire({id: v.id});
    vToFetch.fetch({useMasterKey: true}).then(function(vampire) {
        return Parse.Object.saveAll(_.map(_.toPairs(new_values), function(a) {
            var attribute = a[0], val = a[1];
            var vc = new Parse.Object("VampireChange");
            vc.set({
                "name": attribute,
                "category": "core",
                "old_text": vampire.get(attribute),
                "new_text": val,
                "owner": vampire,
                "type": vampire.has(attribute) ? "core_update" : "core_define",
                "instigator": request.user
            });
            var acl = get_vampire_change_acl(vampire);
            vc.setACL(acl);
            return vc;
        }), {useMasterKey: true});
    }).then(function () {
        return response.success();
    }).fail(function (error) {
        console.log(error.message);
        response.error(error);
    })
});

var isMeaningfulChange = function (vc) {
    var changed = true;
    if ("update" == vc.get("type")) {
        changed = false;
        if (vc.get("old_value") != vc.get("value")) {
            changed = true;
        }
        if (vc.get("old_cost") != vc.get("cost")) {
            changed = true;
        }
        if (vc.get("old_text") != vc.get("name")) {
            changed = true;
        }
        if (vc.get("free_value") != vc.get("old_free_value")) {
            changed = true;
        }
    }

    return changed;
}

Parse.Cloud.beforeSave("SimpleTrait", function(request, response) {
    var vc = new Parse.Object("VampireChange");
    var modified_trait = request.object;
    if (_.isUndefined(modified_trait.id)) {
        var flow_promise = Parse.Promise.as({});
    } else {
        var flow_promise = new Parse.Query("SimpleTrait").get(modified_trait.id, {useMasterKey: true});
    }
    flow_promise.then(function(serverData) {
        console.log("Setting vc");
        vc.set({
            "name": modified_trait.get("name"),
            "category": modified_trait.get("category"),
            "owner": modified_trait.get("owner"),
            "old_value": serverData.value,
            "value": modified_trait.get("value"),
            "type": serverData.value === undefined ? "define" : "update",
            "old_free_value": serverData.free_value,
            "free_value": modified_trait.get("free_value"),
            "old_cost": serverData.cost,
            "cost": modified_trait.get("cost"),
            "old_text": serverData.name,
            "simple_trait_id": modified_trait.id,
            "instigator": request.user
        });

        if (!isMeaningfulChange(vc)) {
            console.log("Update does not actually encode a change");
            response.success();
            return;
        }

        console.log("Sending query for the vampire " + vc.get("owner").id);
        return new Parse.Query("Vampire").get(vc.get("owner").id, {useMasterKey: true});
    }).then(function(vampire) {
        console.log("Getting acl");
        var acl = get_vampire_change_acl(vampire);
        vc.setACL(acl);

        console.log("Sending save acl");
        return vc.save({}, {useMasterKey: true});
    }).then(function () {
        response.success();
        if (!request.object.id) {
            console.log("Successfully beforeSave new SimpleTrait " + modified_trait.get("name") + " for " + modified_trait.get("owner").id);
        } else {
            console.log("Successfully beforeSave SimpleTrait " + request.object.id + " " + modified_trait.get("name") + " for " + modified_trait.get("owner").id);
        }
    }, function (error) {
        var failStr;
        if (!request.object.id) {
            failStr = "Failed to beforeSave new SimpleTrait " + modified_trait.get("name") + " for " + modified_trait.get("owner").get("name") + " because of " + error.message;
        } else {
            failStr = "Failed to beforeSave SimpleTrait " + request.object.id + " " + modified_trait.get("name")  + " for " + modified_trait.get("owner").id + " because of " + error.message;
        }
        console.log(failStr);
        error.message = failStr;
        response.error(error);
    });
});

Parse.Cloud.beforeDelete("SimpleTrait", function(request, response) {
    var vc = new Parse.Object("VampireChange");
    var trait = request.object;
    console.log("beforeDelete SimpleTrait Getting the server trait data");
    (new Parse.Query("SimpleTrait").get(trait.id, {useMasterKey: true})).then(function(serverData) {
        console.log("beforeDelete SimpleTrait Received the server trait data");
        vc.set({
            "name": trait.get("name"),
            "category": trait.get("category"),
            "owner": trait.get("owner"),
            "old_value": serverData.value,
            "value": trait.get("value"),
            "old_free_value": serverData.free_value,
            "free_value": trait.get("free_value"),
            "type": "remove",
            "old_cost": serverData.cost,
            "simple_trait_id": trait.id,
            "instigator": request.user
        });

        console.log("beforeDelete SimpleTrait Getting the vampire owner " + vc.get("owner").id);
        return new Parse.Query("Vampire").get(vc.get("owner").id, {useMasterKey: true});
    }).then(function(vampire) {
        var acl = get_vampire_change_acl(vampire);
        vc.setACL(acl);
        return vc.save({}, {useMasterKey: true});
    }).then(function () {
        response.success();
    }, function (error) {
        var failStr = "beforeDelete SimpleTrait Failed to delete for " + request.object.id + " because of " + pretty(error);
        console.log(failStr);
        error.message = failStr;
        response.error(error);
    });
});

Parse.Cloud.define("removeRedundantHistory", function(request, response) {
    Parse.Cloud.useMasterKey();
    var allHistory = new Parse.Query("VampireChange");
    var redundant = [];
    allHistory.each(function (vc) {
        if (!isMeaningfulChange(vc)) {
            vc.set("marked_redundant", true);
            redundant.push(vc);
        }
    }).then(function() {
        return Parse.Object.destroyAll(redundant);
    }).then(function () {
        response.success();
    }, function(error) {
        response.error(error);
    });
})


var fix_all_vampire_change_acl_for_character = function(v) {
    var acl = get_vampire_change_acl(v);
    Parse.Cloud.useMasterKey();
    var batch = [];
    return new Parse.Query("VampireChange").equalTo("owner", v).each(function (vc) {
        vc.setACL(acl);
        batch.push(vc);
    }).then(function () {
        return Parse.Object.saveAll(batch);
    });
};


Parse.Cloud.define("update_vampire_change_permissions_for", function(request, response) {
    var character_id = request.params.character;
    (new Parse.Query("Vampire").get(character_id)).then(function (v) {
        return fix_all_vampire_change_acl_for_character(v);
    }).then(function() {
        response.success("Successfully updated permissions.");
    }, function(error) {
        if (error.code === Parse.Error.AGGREGATE_ERROR) {
            for (var i = 0; i < error.errors.length; i++) {
                response.error("Couldn't fix " + error.errors[i].object.id + "due to " + error.errors[i].message);
            }
        } else {
            response.error("Update permissions because of " + error.message);
        }
        console.log(pretty(error));
    });
});


Parse.Cloud.define("update_indv_vc_permissions_for", function(request, response) {
    Parse.Cloud.useMasterKey();
    var character_id = request.params.character;
    var vc_id = request.params.change;
    var acl;
    (new Parse.Query("Vampire").get(character_id)).then(function (v) {
        console.log("Got vamp. Getting the ACL");
        acl = get_vampire_change_acl(v);
        var q = new Parse.Query("VampireChange");
        return q.get(vc_id);
    }).then(function(vc) {
        vc.setACL(acl);
        return vc.save();
    }).then(function() {
        response.success("Successfully updated acl on " + vc_id + " for " + character_id);
    }, function(error) {
        if (error.code === Parse.Error.AGGREGATE_ERROR) {
            for (var i = 0; i < error.errors.length; i++) {
                response.error("Couldn't fix " + error.errors[i].object.id + "due to " + error.errors[i].message);
            }
        } else {
            response.error("Update acl because of " + error.message);
        }
        console.log(pretty(error));
    });
});


Parse.Cloud.define("get_expected_vampire_ids", function(request, response) {
    Parse.Cloud.useMasterKey();
    var character_id = request.params.character;
    var results = {
        SimpleTrait: [],
        ExperienceNotation: [],
        VampireChange: []
    };
    var v = new Parse.Object("Vampire", {id: character_id});
    Parse.Promise.when(_.map(["SimpleTrait", "ExperienceNotation", "VampireChange"], function (class_name) {
         var q = new Parse.Query(class_name)
            .equalTo("owner", v)
            .select("id");
         return q.each(function (t) {
             results[class_name].push(t.id);
         })
    })).then(function () {
        console.log("About to return results " + results);
        response.success(results);
    }).fail(function (error) {
        response.error(error);
    })
});



var add_administrator_to_everything = function(model) {
    var acl = model.getACL();
    if (_.isUndefined(acl)) {
        // Not completely defined for some reason
        return Parse.Promise.as([]);
    }
    acl.setRoleReadAccess("Administrator", true);
    acl.setRoleWriteAccess("Administrator", true);
    model.setACL(acl);
    return model.save();
}

Parse.Cloud.define("check_user_password", function(request, response)
{
    var password = request.params.password;

    Parse.User.logIn(request.user.getUsername(), password, {
        success: function(results)
        {
            response.success(true);
        },
        error: function() {
            response.success(false);
        }
    });
});
