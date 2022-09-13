import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

export const styleFunction = (feature: any) => {
  const geometry = feature.getGeometry();
  const styles = [
    new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2
      })
    })
  ];
  const coords = geometry?.getCoordinates() as any;
  coords[0].forEach((coordinate: any) => {
    styles.push(
      new Style({
        geometry: new Point(coordinate),
        image: new Icon({
          src: 'assets/images/red_point.png'
        })
      })
    );
  });
  return styles;
};
