/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.event_plot',['wikiMiner.slider.services'])
.directive('eventPlot', ['timeBounds', function(timeBounds){
       return {
           restrict:'E',
           template:'<svg viewBox="0 0 1000 100"></svg>',
           scope:{
               data:'=',
               scale:'='
           },
           link: function(scope, element, attr){
               scope.timeBounds = timeBounds;
               var svg = d3.select(element[0].children[0])
                   .style('height', '100%')
                   .style('width','100%')
                   .style('min-width','100px');
               var axis = svg.append('g').attr('transform','translate(0,80)');

               scope.$watch('timeBounds',function(newVal){
                   scope.render();
               },true);

               scope.render = function(){
                   axis.call(d3.svg.axis().scale(d3.time.scale().domain(scope.scale).range([0,1000])))
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
               };

           }
       }
    }]);