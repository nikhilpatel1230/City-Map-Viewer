public with sharing class cityMapController {
   
    @AuraEnabled(cacheable=true) 
    public static Map<String,Double> getCoordinatesFromCity(String city){

        String endpoint = 'http://api.positionstack.com/v1/forward?access_key=YOUR_API_KEY&query=' + EncodingUtil.urlEncode(city, 'UTF-8');

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');

        HttpResponse res = http.send(request);

        if(res.getStatusCode() == 200){
        Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        List<Object> data = (List<Object>) responseBody.get('data');
 
        
        if(data != null  && !data.isEmpty()){
            Map<String,Object> first = (Map<String,Object>) data[0];
            Double lat = (Double) first.get('latitude');
            Double lon = (Double) first.get('longitude');
            return new Map<String, Double>{ 'latitude' => lat, 'longitude' => lon };
        }
    } 
        return null;
    }
}
