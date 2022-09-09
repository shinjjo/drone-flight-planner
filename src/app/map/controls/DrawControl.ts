import { Feature, Map } from "ol";
import Control from "ol/control/Control";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export class DrawControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */

   isActivated = false;
   constructor(
        private map: Map, 
        private source: VectorSource,
        opt_options: any
    ) {
    const options = opt_options || {};

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href','https://fonts.googleapis.com/icon?family=Material+Icons' )


    const drawButton = document.createElement('button');
    drawButton.title = 'Toggle poly line'
    drawButton.className = 'draw-control';
    drawButton.innerHTML = '<i class="material-icons">polyline</i>';

    const clearButton = document.createElement('button');
    clearButton.innerHTML ='C'
    clearButton.title = 'Clean up flight plan'

    const element = document.createElement('div');
    element.className = 'ol-rotate ol-control draw-control';
    element.appendChild(drawButton);
    element.appendChild(clearButton)

    super({
      element: element,
      target: options.target,
    });

    drawButton.addEventListener('click', this.toggleDrawStringLine.bind(this), false);
    clearButton.addEventListener('click', this.clearStringLine.bind(this));
  }

  toggleDrawStringLine() {    
    this.isActivated ? 
      this.map.getInteractions().forEach(interaction => { if(interaction instanceof Draw) this.map.removeInteraction(interaction)}) : 
      this.map.addInteraction(new Draw({ type: 'MultiLineString', source: this.source, stopClick: true }));
    
    this.isActivated = !this.isActivated;
  }

  clearStringLine() {
    this.map.getLayers().forEach(
      layer => { 
        if (layer instanceof VectorLayer) { 
          layer.getSource().getFeatures().forEach((feature: Feature) => 
            layer.getSource().removeFeature(feature)
          )
        } 
      }
    )
  }
}