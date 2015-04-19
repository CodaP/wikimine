/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.event_plot',['wikiMiner.slider.services'])
.directive('eventPlot', ['timeBounds', 'scale', 'pageData', function(timeBounds, scale, pageData){
       return {
           restrict:'E',
           template:'<svg viewBox="0 0 1000 100"></svg>',
           scope:{
           },
           link: function(scope, element, attr){
               scope.timeBounds = timeBounds;
               scope.scale = scale;
               var svg = d3.select(element[0].children[0])
                   .style('height', '100%')
                   .style('width','100%')
                   .style('min-width','100px');
               var points = svg.append('g');
               var axis = svg.append('g').attr('transform','translate(0,80)');
               scope.scaler_transform = d3.scale.linear().domain([scale.minDate,scale.maxDate]).range([0,100]);
               scope.$watch('scale',function(newVal){
                   scope.scaler_transform = d3.scale.linear().domain([scope.scale.minDate,scope.scale.maxDate]).range([0,100]);
               }, true);
               scope.$watch('timeBounds',function(newVal){
                   scope.filter();
                   scope.render();
               },true);

               scope.revLocations = pageData.revLocations;


               scope.filter = function(){
                   scope.revLocations.forEach(function(element){
                       var datetime = (new Date(element.data.timestamp)).valueOf();
                       if((scope.scaler_transform(datetime) < timeBounds.maxTime)
                           && (scope.scaler_transform(datetime) > timeBounds.minTime)){
                           element.data.options.visible = true;
                       }
                       else{
                           element.data.options.visible = false;
                       }
                   });
               };

               scope.render = function(){
                   //axis.selectAll('*').remove();
                   axis.call(d3.svg.axis().scale(d3.time.scale().domain([scale.minDate,scale.maxDate]).range([0,1000])))
                   var d = svg.selectAll('rect')
                       .data([timeBounds])
                       .attr('x',function(x){return x.minTime*10})
                       .attr('width',function(x){return (x.maxTime - x.minTime)*10});

                   d.enter()
                       .append('rect')
                       .attr('x',function(x){return x.minTime*10})
                       .attr('y',0)
                       .attr('height',100)
                       .attr('width', function(x){return (x.maxTime - x.minTime)*10})
                       .style('fill','#13b6ff')
                       .style('fill-opacity','15%');

                   d.exit()
                       .remove();

                   var p = points.selectAll('circle')
                       .data(pageData.revLocations);
                   p
                       .attr('cx',function(element) {
                           return scope.scaler_transform((new Date(element.data.timestamp)).valueOf())*10;
                       })
                       .attr('fill',function(element){
                           if(element.data.options.visible){
                               return 'red';
                           }
                           else{
                               return 'gray';
                           }
                       });
                   p
                       .enter()
                       .append('circle')
                       .attr('cx',function(element) {
                           return scope.scaler_transform((new Date(element.data.timestamp)).valueOf())*10;
                       })
                       .attr('cy',50)
                       .attr('r', 3)
                       .attr('fill',function(element){
                           if(element.data.options.visible){
                               return 'red';
                           }
                           else{
                               return 'gray';
                           }
                       });

                   p
                       .exit()
                       .remove();


               };

           }
       }
    }]);