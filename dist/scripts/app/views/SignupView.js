define(["jquery","backbone","parse","../helpers/InjectAuthData","../helpers/FacebookLogin"],function(e,t,n,i,s){var r=t.View.extend({events:{"submit form.signup-form":"signUp","click #signup-with-facebook":"signUpWithFacebook"},el:"#signup",initialize:function(){_.bindAll(this,"signUp"),this.render()},signUpWithFacebook:function(e){var t=this;e.preventDefault(),t.undelegateEvents(),t.$(".signup-form .error").hide(),this.$(".signup-form button").attr("disabled","disabled"),s().then(function(){location.reload()},function(e){console.log(JSON.stringify(e)),t.$(".signup-form .error").html(_.escape(e.message)).show(),t.$(".signup-form button").removeAttr("disabled"),t.delegateEvents()})},signUp:function(e){var t=this,i=this.$("#signup-username").val(),s=this.$("#signup-password").val();return e.preventDefault(),t.undelegateEvents(),t.$(".signup-form .error").hide(),this.$(".signup-form button").attr("disabled","disabled"),n.User.signUp(i,s,{},{success:function(e){location.reload(),t.undelegateEvents()},error:function(e,n){t.$(".signup-form .error").html(_.escape(n.message)).show(),t.$(".signup-form button").removeAttr("disabled"),t.delegateEvents()}}),!1},render:function(){this.template=_.template(e("#signup-template").html())(),this.$el.find("div[role='main']").html(this.template),this.$el.enhanceWithin(),this.delegateEvents()}});return r});