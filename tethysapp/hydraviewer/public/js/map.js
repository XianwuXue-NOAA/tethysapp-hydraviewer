var map,
    browse_layer,
    precip_layer,
    historical_layer,
    sentinel1_layer,
    admin_layer,
    $layers_element;

var today = new Date().toISOString().slice(0, 10)

$(function() {

  var browseSlider = $('#browse-opacity').slider();
  var precipSlider = $('#precip-opacity').slider();
  var historicalSlider = $('#historical-opacity').slider();
  var sentinel1Slider = $('#sentinel1-opacity').slider();

  map = L.map('map',{
    center: [16.50,101.75],
    zoom: 6,
    minZoom:2,
    maxZoom: 16,
    maxBounds: [
     [-120, -220],
     [120, 220]
   ],
 });

  var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
      }).addTo(map);

  $layers_element = $('#layers');
  var $update_element = $('#update_button');

  var viirs_product = "VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1"

  browse_layer = addGibsLayer(browse_layer,viirs_product,today)


  sentinel1_layer = addMapLayer(sentinel1_layer,$layers_element.attr('data-sentinel1-url'))
  historical_layer = addMapLayer(historical_layer,$layers_element.attr('data-historical-url'))
  precip_layer = addMapLayer(precip_layer,$layers_element.attr('data-precip-url'))

  admin_layer = addMapLayer(admin_layer,$layers_element.attr('data-admin-url'))


  $('#product_selection').change(function(){
    var prod = $('#product_selection').val();
    var url = prod.split('|')[1]
    precip_layer.setUrl(url)
  });

  $('#browse_selection').change(function(){
    var prod = $('#browse_selection').val();
    var id = prod.split('|')[1]
    var template =
      '//gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/' +
      id + '/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg'
    browse_layer.setUrl(template)
  });

  $('#browse-opacity').change(function(){
    var opac = parseFloat($('input[id="browse-opacity"]').slider('getValue'))
    browse_layer.setOpacity(opac)
  });

  $('#precip-opacity').change(function(){
    var opac = parseFloat($('input[id="precip-opacity"]').slider('getValue'))
    precip_layer.setOpacity(opac)
  });

  $('#historical-opacity').change(function(){
    var opac = parseFloat($('input[id="historical-opacity"]').slider('getValue'))
    historical_layer.setOpacity(opac)
  });

  $('#sentinel1-opacity').change(function(){
    var opac = parseFloat($('input[id="sentinel1-opacity"]').slider('getValue'))
    sentinel1_layer.setOpacity(opac)
  });

  $("#browse-check").on("click",function(){
    if(this.checked){
      browseSlider.slider('enable')
      var opac = parseFloat($('input[id="browse-opacity"]').slider('getValue'))
      browse_layer.setOpacity(opac)
    }
    else{
      browseSlider.slider('disable')
      browse_layer.setOpacity(0)
    }
  });

  $("#precip-check").on("click",function(){
    if(this.checked){
      precipSlider.slider('enable')
      var opac = parseFloat($('input[id="precip-opacity"]').slider('getValue'))
      precip_layer.setOpacity(opac)
    }
    else{
      precipSlider.slider('disable')
      precip_layer.setOpacity(0)
    }
  });

  $("#historical-check").on("click",function(){
    if(this.checked){
      historicalSlider.slider('enable')
      var opac = parseFloat($('input[id="historical-opacity"]').slider('getValue'))
      historical_layer.setOpacity(opac)
    }
    else{
      historicalSlider.slider('disable')
      historical_layer.setOpacity(0)
    }
  });

  $("#sentinel1-check").on("click",function(){
    if(this.checked){
      sentinel1Slider.slider('enable')
      var opac = parseFloat($('input[id="sentinel1-opacity"]').slider('getValue'))
      sentinel1_layer.setOpacity(opac)
    }
    else{
      sentinel1Slider.slider('disable')
      sentinel1_layer.setOpacity(0)
    }
  });

// end of init function
});

// function to add and update tile layer to map
function addMapLayer(layer,url){
  layer = L.tileLayer(url).addTo(map);
  return layer
}

function addGibsLayer(layer,product,date){
  var template =
    '//gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/' +
    '{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg';

  layer = L.tileLayer(template, {
    layer: product,
    tileMatrixSet: 'GoogleMapsCompatible_Level9',
    maxZoom: 9,
    time: date,
    tileSize: 256,
    subdomains: 'abc',
    noWrap: true,
    continuousWorld: true,
    // Prevent Leaflet from retrieving non-existent tiles on the
    // borders.
    bounds: [
      [-85.0511287776, -179.999999975],
      [85.0511287776, 179.999999975]
    ],
    attribution:
      '<a href="https://wiki.earthdata.nasa.gov/display/GIBS">' +
      'NASA EOSDIS GIBS</a>;'
  });

  map.addLayer(layer);

  return layer
}
