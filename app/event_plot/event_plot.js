/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.event_plot',['wikiMiner.slider.services'])
.directive('eventPlot', ['timeBounds', function(timeBounds){
       return {
           restrict:'E',
           template:'<svg viewBox="0 0 100 10"></svg>',
           scope:{
               data:'='
           },
           link: function(scope, element, attr){
               scope.timeBounds = timeBounds;
               var svg = d3.select(element[0].children[0])
                   .style('height', '100%')
                   .style('width','100%')
                   .style('min-width','100px');

               scope.$watch('timeBounds',function(newVal){
                   scope.render();
               },true);

               scope.render = function(){
                   var d = svg.selectAll('rect')
                       .data([timeBounds])
                       .attr('x',function(x){return x.minTime})
                       .attr('width',function(x){return x.maxTime - x.minTime});

                   d.enter()
                       .append('rect')
                       .attr('x',function(x){return x.minTime})
                       .attr('y',0)
                       .attr('height',10)
                       .attr('width', function(x){return x.maxTime - x.minTime})
                       .style('fill','#13b6ff')
                       .style('fill-opacity','15%');

                   d.exit()
                       .remove();
               };

           }
       }
    }]);