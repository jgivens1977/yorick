/**
 *
 * Created by Andrew on 11/7/2015.
 */

define(["underscore", "jquery", "parse", "../models/Vampire", "backbone"], function (_, $, Parse, Vampire, Backbone) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    describe("A suite", function() {
        it("contains spec with an expectation", function() {
            expect(true).toBe(true);
        });
    });
    var ParseStart = function() {
        Parse.$ = $;
        Parse.initialize("rXfLuSWZZs1xxyeX4IzlG1ZCuglbIoDlGHwg68Ru", "yymp8UWnJ7Va32Y2Q4uzvWxfPTYuDvZSA8kdhmdR");
        if (!Parse.User.current()) {
            return Parse.User.logIn("devuser", "thedumbness");
        }
        return Parse.Promise.as(Parse.User.current());
    };
    describe("Parse", function() {
        beforeAll(function() {
            Parse.$ = $;
            Parse.initialize("rXfLuSWZZs1xxyeX4IzlG1ZCuglbIoDlGHwg68Ru", "yymp8UWnJ7Va32Y2Q4uzvWxfPTYuDvZSA8kdhmdR");
            if (Parse.User.current()) {
                Parse.User.logOut();
            }
        });

        it("isn't logged in", function() {
            expect(Parse.User.current()).toBe(null);
        });
        it("can fail to log in", function(done) {
            Parse.User.logIn("devuser", "thewrongness").then(function(user) {
                done.fail("Logged in with bad password");
            }, function(user, error) {
                done(error);
            });
        });
        it("can log in", function(done) {
            Parse.User.logIn("devuser", "thedumbness").then(function(user) {
                done();
            }, function(user, error) {
                done.fail(error);
            });
        });
    });

    describe("A Vampire's experience history", function() {
        var vampire;
        beforeAll(function (done) {
            ParseStart().then(function () {
                return Vampire.create_test_character();
            }).then(function (v) {
                return Vampire.get_character(v.id);
            }).then(function (v) {
                vampire = v;
                done();
            }, function(error) {
                done.fail(error);
            });
        });

        it("updates listeners on add", function(done) {
            var Listener = Backbone.View.extend({
                initialize: function() {
                    var self = this;
                    _.bindAll(this, "finish");
                },

                finish: function(en) {
                    expect(en.get("reason")).toBe("meet hands");
                    expect(en.get("alteration_earned")).toBe(24);
                    vampire.get_experience_notations().then(function (ens) {
                        var l = _.first(ens.models);
                        expect(l.get("reason")).toBe("meet hands");
                        expect(l.get("alteration_earned")).toBe(24);
                        done();
                    });
                }
            });
            l = new Listener;
            vampire.get_experience_notations(function (rc) {
                l.listenTo(rc, "add", l.finish);
                vampire.add_experience_notation({reason: "meet hands", alteration_earned: 24});
            });
        });

        it("got initial xp", function(done) {
            vampire.get_experience_notations().then(function (ens) {
                var en = _.last(ens.models);
                expect(en.get("reason")).toBe("Character Creation XP");
                expect(en.get("alteration_earned")).toBe(30);
                done();
            })
        });

        it("reports initial xp", function() {
            expect(vampire.experience_available()).toBe(30);
            expect(vampire.get("experience_earned")).toBe(30);
            expect(vampire.get("experience_spent")).toBe(0);
        });
    });

    describe("A Vampire", function() {
        beforeAll(function (done) {
            ParseStart().then(function () {
                done();
            });
        });

        it("can be created", function(done) {
            var random_name = "karmacharactertest" + Math.random().toString(36).slice(2);
            Vampire.create(random_name).then(function (created_vamp) {
                expect(created_vamp.get("name")).toBe(random_name);
                return Vampire.get_character(created_vamp.id);
            }).then(function (v) {
                expect(v.get("name")).toBe(random_name);
                done();
            }, function (error) {
                done.fail(error);
            })
        });

        it("can be fetched", function(done) {
            Vampire.get_character("4lcQwjL97U").then(function(c) {
                expect(c.get("name")).toBe("18 and hating");
                done();
            }, function(error) {
                done.fail(error);
            })
        });

        it("can be fetched with backgrounds", function(done) {
            Vampire.get_character("aH7bi2ctQU", "backgrounds").then(function(c) {
                expect(c.get("name")).toBe("Dis 15");
                var b = c.get("backgrounds");
                expect(b).not.toBe(null);
                expect(b[0].get("name")).toBe("Allies");
                done();
            }, function(error) {
                done.fail(error);
            })
        });

        it("can be fetched with backgrounds and skills", function(done) {
            Vampire.get_character("aH7bi2ctQU", ["backgrounds", "skills"]).then(function(c) {
                expect(c.get("name")).toBe("Dis 15");
                var b = c.get("backgrounds");
                expect(b).not.toBe(null);
                expect(b[0].get("name")).toBe("Allies");
                var s = c.get("skills");
                expect(s).not.toBe(null);
                expect(s[0].get("name")).toBe("Academics");
                done();
            }, function(error) {
                done.fail(error);
            })
        });

        it("can be fetched with assigned container", function(done) {
            var thisCache = {_character: null};
            Vampire.get_character("aH7bi2ctQU", ["backgrounds", "skills"], thisCache).then(function(c) {
                expect(thisCache._character.get("name")).toBe("Dis 15");
                var b = thisCache._character.get("backgrounds");
                expect(b).not.toBe(null);
                expect(b[0].get("name")).toBe("Allies");
                var s = thisCache._character.get("skills");
                expect(s).not.toBe(null);
                expect(s[0].get("name")).toBe("Academics");
                done();
            }, function(error) {
                done.fail(error);
            })
        });

        it("can calculate costs for in and out of clan disciplines", function(done) {
            Vampire.get_character("aH7bi2ctQU", "all").then(function(c) {
                expect(c.get("name")).toBe("Dis 15");
                var expected = {
                    Presence: 56,
                    Potence: 56,
                    Celerity: 48,
                    Obtenebration: 60
                };
                _.each(c.get("disciplines"), function(e) {
                    var cost = c.calculate_trait_cost(e);
                    expect(cost).toBe(expected[e.get("name")]);
                })
                done();
            }, function(error) {
                done.fail(error);
            })
        });

        it("Dis 15 costs didn't change", function(done) {
            Vampire.get_character("aH7bi2ctQU", "all").then(function(c) {
                expect(c.get("name")).toBe("Dis 15");
                var expected = {
                    Academics: 0,
                    "Animal Ken": 0,
                    "Crafts: This crafts is on fire": 30,
                    "Performance: Slapping": 12,
                    "Brawl": 6,
                    "Computer": 20,
                    "Intimidation": 6,
                    "Athletics": 2,
                    "Awareness": 6,
                    "Dodge": 12,
                    "Linguistics": 30,
                    "Melee": 12,
                    "Security": 12,
                    "Streetwise": 20,
                    "Survival": 20,
                    "Performance: Did it do it done it good": 6,
                    "Science: ": 6,
                    "Medicine": 30,
                    "Subterfuge": 20,
                    "Stealth": 2,
                    "Investigation": 6,
                    "Crafts: Deez Nuts": 0,
                    "Lore": 30,
                    "Allies": 12,
                    "Haven": 30,
                    "Rituals": 30,
                    "Generation": 12,
                    "Influences: The Elite": 30,
                    "Influences: The Underworld": 30,
                    "Presence": 56,
                    "Celerity": 48,
                    "Potence": 56,
                    "Obtenebration": 60,
                    "Physical": 3,
                    "Social": 0,
                    "Mental": 0,
                    "Additional Uncommon Discipline": 5,
                    "Path of Death and the Soul": 3,
                    "Necromancy: Call of the Hungry Dead": 2,
                    "Necromancy: Bastone Diabolico": 8,
                    "Necromancy: Black Blood": 4,
                    "Necromancy: Chill of Oblivion": 10,
                    "Necromancy: Circle of Cerberus": 2,
                    "Necromancy: Dark Assistant": 2,
                    "Necromancy: Din of the Damned": 4,
                    "Necromancy: Eyes of the Grave": 2,
                    "Necromancy: Sepulchral Beacon": 4,
                    "Necromancy: Strength of Rotten Flesh": 8,
                    "Instinctive Command": 20,
                    "Denial of Aphrodite's Favor": 20,
                    "Reflection of Endurance": 20,
                    "Control the Savage Beast": 20,
                    "Retain the Quick Blood": 20,
                    "Presence: Love": 30,
                    "Celerity: Quickness": 30,
                    "Potence: Force": 30,
                    "Obtenebration: Shadowstep": 30,
                };
                _.each(c.get("disciplines"), function(e) {
                    var cost = c.calculate_trait_cost(e);
                    expect(cost).toBe(expected[e.get("name")]);
                })
                done();
            }, function(error) {
                done.fail(error);
            })
        });
    });
});