import {Directive} from 'angular2/src/core/annotations/annotations'
import {NgElement} from 'angular2/src/render/ng_element';
import * as viewModule from './view';
import * as eiModule from './element_injector';
import {ShadowDomStrategy} from 'angular2/src/render/shadow_dom/shadow_dom_strategy';
import {EventManager} from 'angular2/src/render/events/event_manager';
import {ListWrapper} from 'angular2/src/facade/collection';
import {Type} from 'angular2/src/facade/lang';


export class PrivateComponentLocation {
  _elementInjector:eiModule.ElementInjector;
  _elt:NgElement;
  _view:viewModule.View;

  constructor(elementInjector:eiModule.ElementInjector, elt:NgElement, view:viewModule.View){
    this._elementInjector = elementInjector;
    this._elt = elt;
    this._view = view;
  }

  createComponent(type:Type, annotation:Directive, componentProtoView:viewModule.ProtoView,
                  eventManager:EventManager, shadowDomStrategy:ShadowDomStrategy) {
    var context = this._elementInjector.createPrivateComponent(type, annotation);

    var renderView = componentProtoView.render.instantiate(eventManager);
    renderView.hydrate(null);
    var view = componentProtoView.instantiate(renderView, this._elementInjector, eventManager);
    view.hydrate(this._elementInjector.getShadowDomAppInjector(), this._elementInjector, context, null);

    this._view.render.setComponentView(
      this._elementInjector.getElementBinderIndex(),
      renderView
    );

    ListWrapper.push(this._view.componentChildViews, view);
    this._view.changeDetector.addChild(view.changeDetector);
  }
}
