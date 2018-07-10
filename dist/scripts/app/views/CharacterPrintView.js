define(["jquery","backbone","backform","text!../templates/character-print-view.html","../helpers/VampirePrintHelper","marionette","text!../templates/character-print-parent.html","text!../templates/print/blood.html","text!../templates/print/morality.html","text!../templates/print/willpower.html","text!../templates/print/health-levels.html","text!../templates/print/skills.html","text!../templates/print/section.html","text!../templates/print/gnosis.html","text!../templates/print/total.html","text!../templates/print/fixed-blood.html","../forms/PrintSettingsForm"],function(e,t,i,a,l,o,s,n,r,m,p,d,c,h,u,f,w){var b=o.ItemView.extend({template:_.template('<h1 class="ui-bar ui-bar-a"><%= format_simpletext("name") %></h1>'),templateHelpers:function(){var e=this;return{format_simpletext:e.format_simpletext}},initialize:function(){_.bindAll(this,"format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(b.prototype,l);var v=o.ItemView.extend({className:"ui-grid-b ui-responsive",template:function(e){var t=this,i=_.map(t.fields,function(t,i){if(e[t.name])return'<div class="ui-block-'+String.fromCharCode(97+i)+'">                                <h2 class="ui-bar ui-bar-a">'+t.display+': <%= format_simpletext("'+t.name+'") %></h2>                            </div>'});return i=_.without(i,void 0),(i=_.template(i.join("")))(e)},templateHelpers:function(){var e=this;return{format_simpletext:e.format_simpletext}},initialize:function(e){var t=this;this.fields=e.fields,_.each(this.fields,function(e){t.listenTo(t.model,"change:"+e.name,t.render)}),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(v.prototype,l);var y=o.ItemView.extend({template:function(e){var t=this,i=_.map(["Physical","Social","Mental"],function(e,i){var a=['<div class="ui-block-'+String.fromCharCode(97+i)+'">'];a.push('<h4 class="ui-bar ui-bar-a ui-corner-all">'+e+"</h4>"),a.push('<div class="ui-body">');var l=_.find(t.model.get("attributes"),"attributes.name",e);return l&&a.push(t.format_attribute_value(l)),a.push("<br/>"),a.push(t.format_attribute_focus(e)),a.push("</div></div>"),a.join("")});return i=_.without(i,void 0),(i=_.template(i.join("")))(e)},templateHelpers:function(){var e=this;return{format_simpletext:e.format_simpletext,format_attribute_value:e.format_attribute_value,format_attribute_focus:e.format_attribute_focus}},initialize:function(e){var t=this;this.$el.addClass("ui-grid-b"),this.$el.addClass("ui-responsive"),_.each(this.fields,function(e){t.listenTo(t.model,"change:"+e,t.render)}),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(y.prototype,l);var x=o.ItemView.extend({template:_.template(n),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){var t=this;t.listenTo(t.model,"change:backgrounds",t.render),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)}});_.extend(x.prototype,l);var g=o.ItemView.extend({template:_.template(f),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)}});_.extend(g.prototype,l);var z=o.ItemView.extend({template:_.template(m),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){var t=this;t.listenTo(t.model,"change:willpower_sources",t.render),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(z.prototype,l);var V=o.ItemView.extend({template:_.template(h),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){var t=this;t.listenTo(t.model,"change:gnosis_sources",t.render),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(V.prototype,l);var C=o.ItemView.extend({template:_.template(r),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){var t=this;t.listenTo(t.model,"change:paths",t.render),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(C.prototype,l);var k=o.ItemView.extend({template:_.template(p),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){var t=this;this.column=e.column,t.listenTo(t.model,"change:health_levels",t.render),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)}});_.extend(k.prototype,l);var A=o.ItemView.extend({template:_.template(u),templateHelpers:function(){var e=this;return{character:e.model}},initialize:function(e){_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)}});_.extend(A.prototype,l);var T=o.ItemView.extend({template:_.template(d),templateHelpers:function(){var e=this,t=e.model.get_sorted_skills();return{character:e.model,skills:t,groupedSkills:e.model.get_grouped_skills(t,3),format_skill:e.format_skill}},initialize:function(e){var t=this;t.listenTo(t.model,"change:skills",t.render),t.base_abilities=[],t.base_abilities.push(["Academics","Animal Ken","Athletics","Awareness","Brawl","Computer","Crafts","Dodge","Drive"]),t.base_abilities.push(["Empathy","Firearms","Intimidation","Investigation","Leadership","Linguistics","Lore","Medicine","Melee","Occult"]),t.base_abilities.push(["Performance","Science","Security","Stealth","Streetwise","Subterfuge","Survival"]),t.base_abilities=_.flatten(t.base_abilities),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")}});_.extend(T.prototype,l);var $=o.ItemView.extend({template:_.template(c),templateHelpers:function(){var e=this;return _.each(e.sections,function(t){var i=t.sort||"name",a=t.direction||"asc",l=e.model.get(t.name);"name"==i?l=_.sortByAll(l,["attributes.name"]):"value"==i&&(l=_.sortByAll(l,["attributes.value","attributes.name"])),"desc"==a&&(l=_(l).reverse().value()),t.values=l}),{character:e.model,sections:e.sections,format_skill:e.format_skill}},initialize:function(e){var t=this;this.column=e.column,this.sections=e.sections,_.each(t.sections,function(e){t.listenTo(t.model,"change:"+e.name,t.render)}),_.bindAll(this,"render","template","format_simpletext","format_attribute_value","format_attribute_focus","format_skill","format_specializations")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)}});_.extend($.prototype,l);var I=o.ItemView.extend({template:_.template("<%= inputtext %>"),templateHelpers:function(){var e=this,t="";if(e.options.print_options.get("exclude_extended"))return{inputtext:""};var i=e.model.get_fetched_long_text("extended_print_text");return i&&i.has("text")&&(t=i.get("text")),t=_.template(t)({character:e.model}),{inputtext:t}},initialize:function(e){var t=this;this.$el.addClass("ui-block-a"),t.listenTo(t.model,"change",t.render),t.listenTo(t.options.print_options,"change:exclude_extended",t.render)}});_.extend(I.prototype,l);var H=o.LayoutView.extend({template:_.template(s),regions:{settings:"#cpp-settings",header:"#cpp-header",firstbar:"#cpp-firstbar",secondbar:"#cpp-secondbar",attributeRegion:"#cpp-attributes",blood:"#cpp-blood",morality:"#cpp-morality",willpower:"#cpp-willpower",health_levels:"#cpp-health-levels",total_a:"#cpp-total-a",total_b:"#cpp-total-b",total_c:"#cpp-total-c",skills:"#cpp-skills",bottom_one_a:"#cpp-bottom-one-a",bottom_one_b:"#cpp-bottom-one-b",bottom_one_c:"#cpp-bottom-one-c",bottom_two_a:"#cpp-bottom-two-a",bottom_two_b:"#cpp-bottom-two-b",bottom_two_c:"#cpp-bottom-two-c",extended_print_text:"#cpp-extended-print-text"},setup_regions:function(){var e=this,i=e.options||{},a=e.override.get("character")||e.character;i.no_print_settings_form||e.showChildView("settings",new w({model:e.print_options}),i),e.showChildView("extended_print_text",new I({model:a,print_options:e.print_options}),i),"Werewolf"==a.get("type")?(e.showChildView("header",new b({model:a}),i),e.showChildView("firstbar",new v({model:a,fields:[{name:"wta_tribe",display:"Tribe"},{name:"wta_breed",display:"Breed"},{name:"wta_auspice",display:"Auspice"}]}),i),e.showChildView("secondbar",new v({model:a,fields:[{name:"archetype",display:"Archetype"},{name:"archetype_2",display:"Archetype"},{name:"wta_camp",display:"Camp"},{name:"wta_faction",display:"Faction"}]}),i),e.showChildView("attributeRegion",new y({model:a}),i),e.showChildView("blood",new V({model:a,column:1}),i),e.showChildView("willpower",new z({model:a}),i),e.showChildView("health_levels",new k({model:a}),i),"Ananasi"!=a.get("wta_tribe")?e.showChildView("morality",new A({model:new t.Model({name:"Rage",total:10,split:7})}),i):e.showChildView("morality",new g({model:new t.Model({generation:0,total:15,split:5,linebreak:10,blood_per_turn:3})}),i),e.showChildView("total_a",new A({model:new t.Model({name:"Harano",total:5,split:5})}),i),e.showChildView("total_b",new A({model:new t.Model({name:"Wyrm Taint",total:5,split:5})}),i),e.showChildView("total_c",new A({model:new t.Model({name:"Seethe Traits",total:10,split:5})}),i),e.showChildView("skills",new T({model:a}),i),e.showChildView("bottom_one_a",new $({model:a,sections:[{display:"Backgrounds",name:"wta_backgrounds",format:1},{display:"Haven",name:"haven_specializations",format:1},{display:"Influences: The Elite",name:"influence_elite_specializations",format:1},{display:"Influences: The Underworld",name:"influence_underworld_specializations",format:1},{display:"Contacts",name:"contacts_specializations",format:1},{display:"Allies",name:"allies_specializations",format:1},{display:"Rites",name:"wta_rites",format:1}]}),i),e.showChildView("bottom_one_b",new $({model:a,sections:[{display:"Gifts",name:"wta_gifts",format:1,sort:"value",direction:"asc"}]}),i),e.showChildView("bottom_one_c",new $({model:a,sections:[{display:"Merits",name:"wta_merits",format:4},{display:"Flaws",name:"wta_flaws",format:4},{display:"Monikers",name:"monikers",format:4}]}),i),e.showChildView("bottom_two_a",new $({model:a,sections:[{display:"Lores",name:"lore_specializations",format:0},{display:"Academics",name:"academics_specializations",format:0},{display:"Totem Bonuses",name:"wta_totem_bonus_traits",format:0}]}),i),e.showChildView("bottom_two_b",new $({model:a,sections:[{display:"Rituals",name:"rituals",format:0}]}),i),e.showChildView("bottom_two_c",new $({model:a,sections:[{display:"Languages",name:"linguistics_specializations",format:0},{display:"Drive",name:"drive_specializations",format:0}]}),i)):(e.showChildView("header",new b({model:a}),i),e.showChildView("firstbar",new v({model:a,fields:[{name:"clan",display:"Clan"},{name:"archetype",display:"Archetype"},{name:"antecedence",display:"Antecedence"}]}),i),e.showChildView("secondbar",new v({model:a,fields:[{name:"sect",display:"Sect"},{name:"faction",display:"Faction"},{name:"title",display:"Title"}]}),i),e.showChildView("attributeRegion",new y({model:a}),i),e.showChildView("blood",new x({model:a}),i),e.showChildView("morality",new C({model:a}),i),e.showChildView("willpower",new z({model:a}),i),e.showChildView("health_levels",new k({model:a}),i),e.showChildView("skills",new T({model:a}),i),e.showChildView("bottom_one_a",new $({model:a,sections:[{display:"Backgrounds",name:"backgrounds",format:1},{display:"Haven",name:"haven_specializations",format:1},{display:"Influences: The Elite",name:"influence_elite_specializations",format:1},{display:"Influences: The Underworld",name:"influence_underworld_specializations",format:1},{display:"Contacts",name:"contacts_specializations",format:1},{display:"Sabbat Rituals",name:"sabbat_rituals",format:1},{display:"Allies",name:"allies_specializations",format:1}]}),i),e.showChildView("bottom_one_b",new $({model:a,sections:[{display:"Disciplines",name:"disciplines",format:1},{display:"Techniques",name:"techniques",format:0},{display:"Elder Disciplines",name:"elder_disciplines",format:0}]}),i),e.showChildView("bottom_one_c",new $({model:a,sections:[{display:"Merits",name:"merits",format:4},{display:"Flaws",name:"flaws",format:4},{display:"Status",name:"status_traits",format:4}]}),i),e.showChildView("bottom_two_a",new $({model:a,sections:[{display:"Lores",name:"lore_specializations",format:0},{display:"Academics",name:"academics_specializations",format:0}]}),i),e.showChildView("bottom_two_b",new $({model:a,sections:[{display:"Rituals",name:"rituals",format:0}]}),i),e.showChildView("bottom_two_c",new $({model:a,sections:[{display:"Languages",name:"linguistics_specializations",format:0},{display:"Drive",name:"drive_specializations",format:0},{display:"Texts",name:"vampiric_texts",format:0}]}),i))},onRender:function(){this.setup_regions()},initialize:function(e){_.bindAll(this,"setup_regions"),this.print_options=new t.Model({font_size:100,exclude_extended:!1})},match_font_size:function(){this.$el.css("font-size",""+this.print_options.get("font_size")+"%")},setup:function(e){var i=this,a=e.character,l=e.override;if(i.stopListening(i.print_options),e.print_options&&(i.print_options=e.print_options),i.match_font_size(),i.listenTo(i.print_options,"change:font_size",i.match_font_size),!i.lasttribe||i.character.get("wta_tribe")!=i.lasttribe||a!=i.character)return i.lasttribe=a.get("wta_tribe"),i.character=a,i.override&&i.stopListening(i.override),i.override=l||new t.Model({character:null}),i.listenTo(i.override,"change",_.debounce(i.setup_regions,100,{trailing:!0})),i.render(),i}});return H});