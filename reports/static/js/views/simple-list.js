define([
  'jquery',
  'underscore',
  'backbone',
  'backbone_pageable',
  'backgrid',
  'iccbl_backgrid',
  'models/app_state',
  'views/generic_selector',
  'text!templates/simple-list.html',
  'text!templates/modal_ok_cancel.html'
], function(
    $, _, Backbone, BackbonePageableCollection, Backgrid, Iccbl, appModel, 
    genericSelector, listTemplate, modalTemplate ){

  // for compatibility with require.js, attach PageableCollection in the right place on the Backbone object
  // see https://github.com/wyuenho/backbone-pageable/issues/62
  Backbone.PageableCollection = BackbonePageableCollection;

  var ajaxStart = function(){
      $('#loading').fadeIn({duration:100});
  };
  var ajaxComplete = function(){
      $('#loading').fadeOut({duration:100});
  };
  $(document).bind("ajaxComplete", function(){
      ajaxComplete(); // TODO: bind this closer to the collection
  });

  var ListView = Backbone.Layout.extend({
    LIST_ROUTE_ORDER: ['rpp', 'page','order','search'],

    initialize : function(attributes, options) {
        var self = this;
        this.options = options;
        var schemaResult = this.schemaResult = options.schemaResult;

        this.objects_to_destroy = _([]);

        var data = { message: '' };
        var compiledTemplate = this.compiledTemplate = _.template( listTemplate, data );

        var collection = this.collection = options.collection;
        
        console.log('initialize list:' + JSON.stringify(this.options.columns));
        var grid = this.grid = new Backgrid.Grid({
          columns: this.options.columns,
          collection: this.options.collection,
        });

        this.objects_to_destroy.push(grid);

        // Paginator
        var paginator = self.paginator = new Backgrid.Extension.Paginator({
          collection: self.collection
        });
        this.objects_to_destroy.push(paginator);

        // Extraselector
        if( _.has(schemaResult, 'extraSelectorOptions')){
            var searchHash = self.model.get('search');
            console.log('extraselector init: searchTerms: ' + JSON.stringify(searchHash));

            var extraSelectorModel = new Backbone.Model({ selection: '' });
            var extraSelectorKey = schemaResult.extraSelectorOptions.searchColumn;
            _.each(_.keys(searchHash), function(key){
                console.log('key: ' + key + ', extrSelectorKey: ' + extraSelectorKey);
                if( key == extraSelectorKey){
                    extraSelectorModel.set({ selection: searchHash[key] });
                }
            });
            var extraSelectorInstance = self.extraSelectorInstance =
                new genericSelector({ model: extraSelectorModel } , schemaResult.extraSelectorOptions );
            this.objects_to_destroy.push(extraSelectorInstance);

            this.listenTo(this.model, 'change: search', function(){
                var searchHash = self.model.get('search');
                console.log('extraselector, search changed: ' + JSON.stringify(searchHash));
                _.each(_.keys(searchHash), function(key){
                    console.log('key: ' + key + ', extrSelectorKey: ' + extraSelectorKey);
                    if( key == extraSelectorKey){
                        extraSelectorModel.set({ selection: searchHash[key] });
                    }
                });
            });
            this.listenTo(extraSelectorModel, 'change', function() {
                console.log('===--- extraSelectorModel change');
                var searchHash = _.clone(self.model.get('search'));
                var value = extraSelectorModel.get('selection');
                searchHash[extraSelectorKey] = value;
                self.model.set('search', searchHash);
            });
        }


        this.listenTo(
          self.collection, "MyCollection:detail", 
          function (model) {
            try{
              
            } catch (e){
              console.log('caught error: ' + JSON.stringify(e));
              var idList = Iccbl.getIdKeys(model,schemaResult);
              appModel.set({
                current_scratch: { schemaResult: schemaResult, model: model},
              });
              // NOTE: prefer to send custom signal, rather than uriStack:change for 
              // detail/edit; this allows the parent to decide URI signalling
            }
            self.trigger('detail', model);
          });        
        
        // TODO: work out the specifics of communication complete event
        this.listenTo(self.collection, 'request', ajaxStart);
        this.listenTo(self.collection, 'error', ajaxComplete);
        this.listenTo(self.collection, 'complete', ajaxComplete);

        console.log('list view initialized');
    },


    remove: function(){
        console.log('ListView remove called');
        Backbone.View.prototype.remove.apply(this);
    },

    onClose: function(){
        console.log('Extra onclose method called');
        if(_.isObject(this.objects_to_destroy)){
            this.objects_to_destroy.each(function(view_obj){
                view_obj.remove();
                view_obj.unbind();
                view_obj.stopListening();
            });
        }
    },

    afterRender: function(){
        var self = this;
        this.$el.html(this.compiledTemplate);
        this.$("#example-table").append(this.grid.render().$el);
        self.$("#paginator-div").append(self.paginator.render().$el);
        if(!_.isUndefined(self.extraSelectorInstance)){
            self.$("#extra-selector-div").append(self.extraSelectorInstance.render().$el);
        }
        var fetched = false;
        if ( !fetched ) {
          var fetchOptions = { reset: false, error: appModel.jqXHRerror };
          self.collection.fetch(fetchOptions);
        }
        this.delegateEvents();
        return this;
    }

  });

  return ListView;
});