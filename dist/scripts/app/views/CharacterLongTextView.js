define(["jquery","backbone","parse","backform","marionette","../helpers/PromiseFailReport","text!../templates/character-long-text-parent.html"],function(e,t,i,n,r,o,a){var s=r.ItemView.extend({tagName:"form",template:_.template(""),initialize:function(t){var i=this;i.character=t.character,this.form=new n.Form({el:this.$el,model:i.model,fields:[{name:"text",label:t.pretty,control:"textarea",helpMessage:t.description},{name:"preview",label:"Live Preview Changes",control:"checkbox"},{name:"submit",label:"Update",control:"button",disabled:!0,id:"submit"}],events:{change:function(e){e.preventDefault(),this.model.errorModel.clear(),this.fields.get("submit").set({status:"",message:"",disabled:!1}),this.$el.enhanceWithin()},submit:function(n){var r=this;return n.preventDefault(),e.mobile.loading("show"),r.undelegateEvents(),r.model.errorModel.clear(),i.character.update_long_text(t.category,r.model.get("text")).then(function(){r.fields.get("submit").set({status:"success",message:"Successfully Updated",disabled:!0}),r.$el.enhanceWithin()},function(e){r.fields.get("submit").set({status:"error",message:_.escape(e.message),disabled:!1}),r.$el.enhanceWithin()}).always(function(){e.mobile.loading("hide"),r.delegateEvents()}),!1}}})},onRender:function(){return this.form.render(),this.$el.enhanceWithin(),this}}),l=r.ItemView.extend({tagName:"div",template:_.template("<h1>Preview</h1><p><%= inputtext %></p>"),templateHelpers:function(){var e=this,t="";if(e.model.get("preview"))t=e.model.get("text");else{var i=e.options.character.get_fetched_long_text(e.options.category);i&&i.has("text")&&(t=i.get("text"))}return t=_.template(t)({character:e.options.character}),{inputtext:t}},initialize:function(e){var t=this;t.options=e,t.listenTo(t.options.character,"change:longtext"+t.options.category,t.render),t.listenTo(t.model,"change:text",t.renderIfLive),_.bindAll(t,"renderIfLive","templateHelpers")},renderIfLive:function(){var e=this;if(e.model.get("preview"))return e.render()},onRender:function(){this.$el.enhanceWithin()}}),c=r.ItemView.extend({tagName:"div",template:_.template("<p><%= inputtext %></p>"),templateHelpers:function(){var e=this;return{inputtext:e.options.description}},initialize:function(e){var t=this;t.options=e,_.bindAll(t,"templateHelpers")},onRender:function(){this.$el.enhanceWithin()}}),p=r.LayoutView.extend({template:_.template(a),regions:{top:"#top",edit:"#edit",preview:"#preview"},setup_regions:function(){var e=this,t={};e.showChildView("top",new c({description:e.options.description})),e.showChildView("edit",new s({character:e.character,category:e.options.category,pretty:e.options.pretty,model:e.editingoptions}),t),e.showChildView("preview",new l({character:e.character,category:e.options.category,model:e.editingoptions}),t)},onRender:function(){this.setup_regions()},initialize:function(e){_.bindAll(this,"setup_regions")},setup:function(e,i){var n=this;n.options=i||n.options,n.character=e,n.editingoptions=new t.Model({preview:!0});var r=n.character.get_fetched_long_text(i.category);return r&&r.has("text")&&n.editingoptions.set("text",r.get("text")),n.render(),n}});return p});