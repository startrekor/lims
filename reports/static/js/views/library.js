/**
 * Library form/view
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'iccbl_backgrid',
  'layoutmanager',
  'models/app_state',
  'views/libraryCopies', 
  'views/libraryCopyPlates', 
  'views/libraryWells', 
  'views/libraryVersions',
  'views/generic_detail_layout',
  'views/list2',
  'text!templates/library.html'
], function($, _, Backbone, Iccbl, layoutmanager, appModel, LibraryCopiesView, 
            LibraryCopyPlatesView, LibraryWellsView, LibraryVersionsView,
            DetailLayout, ListView, 
            libraryTemplate) {
  
  var LibraryView = Backbone.Layout.extend({
    
    initialize: function(args) {
      var self = this;
      this.tabViews = {}; // view cache
      this.uriStack = args.uriStack;
      this.consumedStack = [];
      
      _.each(_.keys(this.tabbed_resources), function(key){
        if(key !== 'detail' && !appModel.hasPermission(self.tabbed_resources[key].permission)){
          delete self.tabbed_resources[key];
        }
      });
      console.log('check1');
      _.bindAll(this, 'click_tab');
    },
    
    template: _.template(libraryTemplate),

    tabbed_resources: {
      detail: { 
        description: 'Library Details', 
        title: 'Library Details', 
        invoke: 'setDetail'
      },
      copy: { 
        description: 'Copies', title: 'Copies', invoke: 'setCopies',
        permission: 'permission/resource/librarycopy/read'
      },
      plate: { 
        description: 'Plates', title: 'Plates', invoke: 'setPlates' ,
        permission: 'permission/resource/librarycopyplate/read'
      },
      well: { 
        description: 'Well based view of the library contents', 
        title: 'Wells', invoke: 'setWells' ,
        permission: 'permission/resource/well/read'
      },
      version: { 
        description: 'Library contents version', 
        title: 'Versions', invoke: 'setVersions' ,
        permission: 'permission/resource/librarycontentsversion/read'
      }
    },      
    
    events: {
      // TODO: how to make this specific to this view? 
      // (it is also catching clicks on the table paginator)
      //          'click .tabbable li': 'click_tab', 
        'click li': 'click_tab',
    },
    
    /**
     * Child view bubble up URI stack change event
     */
    reportUriStack: function(reportedUriStack) {
      var consumedStack = this.consumedStack || [];
      var actualStack = consumedStack.concat(reportedUriStack);
      this.trigger('uriStack:change', actualStack );
    },
    
    /**
     * Layoutmanager hook
     */
    serialize: function() {
      return {
//        'title': Iccbl.getTitleFromTitleAttribute(this.model, this.model.resource.schema),
        'tab_resources': this.tabbed_resources
      }      
    }, 
    
    /**
     * Layoutmanager hook
     */
    afterRender: function(){
      var viewId = 'detail';
      if (!_.isEmpty(this.uriStack)){
        viewId = this.uriStack.shift();
        if (!_.has(this.tabbed_resources, viewId)){
          var msg = 'could not find the tabbed resource: ' + viewId;
          appModel.error(msg);
          throw msg;
        }
      }
      this.change_to_tab(viewId);
    },
    
    click_tab : function(event){
      event.preventDefault();
      // Block clicks from the wrong elements
      // TODO: how to make this specific to this view? (is it still also catching
      // clicks on the table paginator?)
      var key = event.currentTarget.id;
      if(_.isEmpty(key)) return;
      this.change_to_tab(key);
    },

    change_to_tab: function(key){
      if(_.has(this.tabbed_resources, key)){
        this.$('li').removeClass('active');
        this.$('#' + key).addClass('active');
        this.consumedStack = [key];
        var delegateStack = _.clone(this.uriStack);
        this.uriStack = [];
        var method = this[this.tabbed_resources[key]['invoke']];
        if (_.isFunction(method)) {
          method.apply(this,[delegateStack]);
        } else {
          throw "Tabbed resources refers to a non-function: " + this.tabbed_resources[key]['invoke']
        }
      }else{
        var msg = 'Unknown tab: ' + key;
        appModel.error(msg);
        throw msg;
      }
    },
    
    setDetail: function(delegateStack) {
      var key = 'detail';
      
      var view = this.tabViews[key];
      if ( !view ) {
        view = new DetailLayout({ model: this.model});
        this.tabViews[key] = view;
      } 
      // NOTE: have to re-listen after removing a view
      this.listenTo(view , 'uriStack:change', this.reportUriStack);
      // NOTE: if subview doesn't report stack, report it here
      //      this.reportUriStack([]);
      this.setView("#tab_container", view ).render();
    },

    setVersions: function(delegateStack) {
      var self = this;
      var key = 'version';
      var view = this.tabViews[key];
      if ( !view ) {
        var view = new LibraryVersionsView({
          library: self.model,
          uriStack: delegateStack
        });
        self.tabViews[key] = view;
        Backbone.Layout.setupView(view);
      } else {
        self.reportUriStack([]);
      }
      // NOTE: have to re-listen after removing a view
      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      this.setView("#tab_container", view ).render();
    },

    setWells: function(delegateStack) {
      var self = this;
      var key = 'well';
      var view = this.tabViews[key];
      if ( !view ) {
        var view = new LibraryWellsView({
          library: self.model,
          uriStack: delegateStack
        });
        self.tabViews[key] = view;
        Backbone.Layout.setupView(view);
      } else {
        self.reportUriStack([]);
      }
      // NOTE: have to re-listen after removing a view
      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      this.setView("#tab_container", view ).render();
    },

    setPlates: function(delegateStack) {
      var self = this;
      var key = 'plate';
      var view = this.tabViews[key];
      if ( !view ) {
        var view = new LibraryCopyPlatesView({
          library: self.model,
          uriStack: delegateStack
        });
        self.tabViews[key] = view;
        Backbone.Layout.setupView(view);
      } else {
        self.reportUriStack([]);
      }
      // NOTE: have to re-listen after removing a view
      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      this.setView("#tab_container", view ).render();
    },

    setCopies: function(delegateStack) {
      var self = this;
      var key = 'copy';
      var view = this.tabViews[key];
      if ( !view ) {
        var view = new LibraryCopiesView({
          library: self.model,
          uriStack: delegateStack
        });
        self.tabViews[key] = view;
        Backbone.Layout.setupView(view);
      } else {
        self.reportUriStack([]);
      }
      // NOTE: have to re-listen after removing a view
      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      this.setView("#tab_container", view ).render();
    },
    
    onClose: function() {
      // TODO: is this necessary when using Backbone LayoutManager
      this.tabViews = {};
      this.remove();
    }
  
  });
  
  return LibraryView;
});