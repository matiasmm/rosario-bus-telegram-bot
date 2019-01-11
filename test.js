import CuandoDialog from './src/dialogs/CuandoDialog';

const z = new CuandoDialog({ onText: () => {} }, /x/);

const result = z.makeButtons( {"6231":{"calles":["TUCUMÁN","SANTIAGO"],"nro":"6231","destino":"A BATTLE ORDOÑEZ Y OV. LAGOS","lineas":[{"identidad":"18","bandera":"NEGRO","idlinea":"1131","text":"112 NEGRO","value":"12","destino":"A BATTLE ORDOÑEZ Y OV. LAGOS"},{"identidad":"20","bandera":"UNICO","idlinea":"1167","text":"137 UNICO","value":"37","destino":"AV. BATLLE Y ORDOÑEZ Y BV. ORO"},{"identidad":"18","bandera":"ROJO","idlinea":"1131","text":"112 ROJO","value":"13","destino":"A BATTLE ORDOÑEZ Y OV. LAGOS"},{"identidad":"20","bandera":"UNICO","idlinea":"1129","text":"136 UNICO","value":"36","destino":"BV. OROÑO Y AV. BATLLE Y ORDOÑ"}]}}
, "6231"
);

console.log(result)