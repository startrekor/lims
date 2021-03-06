define([
  'jquery',
  'underscore',
  'backbone',
  'layoutmanager',
  'iccbl_backgrid',
  'models/app_state',
  'views/list2',
  'views/generic_detail_layout',
  'views/library',
  'text!templates/genericResource.html'
], 
function($, _, Backbone, layoutmanager, Iccbl, appModel, ListView, DetailLayout, 
         LibraryView, layout) {
  
  var VIEWS = {
    'ListView': ListView, 
    'DetailView': DetailLayout
  };
    
  var LibraryWellView = Backbone.Layout.extend({
    
    template: _.template(layout),
    
    initialize: function(args) {
      this.uriStack = args.uriStack;
      this.library = args.library;
      this.consumedStack = [];
      _.bindAll(this, 'showDetail');
    },
    
    /**
     * Child view bubble up URI stack change event
     */
    reportUriStack: function(reportedUriStack) {
      var consumedStack = this.consumedStack || [];
      var actualStack = consumedStack.concat(reportedUriStack);
      this.trigger('uriStack:change', actualStack );
    },

    // layoutmanager hook
    afterRender: function() {
      var uriStack = this.uriStack;
      var library = this.library;

      var url = library.resource.apiUri +'/' + library.key + '/well/';
      var resourceId = 'well';
      var resource = appModel.getResource(resourceId);

      // Test for list args, if not found, then it's a detail view
      if (!_.isEmpty(uriStack) && !_.isEmpty(uriStack[0]) &&
              !_.contains(appModel.LIST_ARGS, uriStack[0]) ) {
        var _key = Iccbl.popKeyFromStack(resource,uriStack,this.consumedStack);

        appModel.getModel(resourceId, _key, this.showDetail );
      } else {
        this.consumedStack = [];
        this.showList(resource, url);
      }
    },    
    
    showDetail: function(model) {
      var self = this;
      var uriStack = _.clone(this.uriStack);
      // get the view class
      var viewClass = DetailLayout;
      var view = new viewClass({ model: model, uriStack: uriStack });

      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      self.setView('#content', view).render();
    },
    
    showList: function(resource, url) {

      var self = this;
      var uriStack = _.clone(this.uriStack);
      var view = new ListView({ options: {
        uriStack: uriStack,
        schemaResult: resource.schema,
        resource: resource,
        url: url
      }});
      self.listenTo(view, 'detail', function(model) {
        var key = Iccbl.getIdFromIdAttribute(model,resource.schema);
        model.resource = resource;
        model.key = key;
        var keysToReport = Iccbl.getIdKeys(model,resource.schema);
        self.consumedStack = keysToReport;
        self.showDetail(model);
      });
    
      self.listenTo(view , 'uriStack:change', self.reportUriStack);
      Backbone.Layout.setupView(view);
      self.setView('#content', view ).render();
    }
  });

  return LibraryWellView;
});