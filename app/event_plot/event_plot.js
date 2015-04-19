/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.event_plot',['wikiMiner.slider.services'])
.directive('eventPlot', ['timeBounds', 'scale', function(timeBounds, scale){
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
               var points = svg.append('g');
               var axis = svg.append('g').attr('transform','translate(0,80)');

               scope.$watch('timeBounds',function(newVal){
                   scope.filter();
                   scope.render();
               },true);

               scope.points = [];

               scope.filter = function(){
                   scope.points = [];
                   for(var page in scope.data.query.pages){
                       if(scope.data.query.pages.hasOwnProperty(page)){
                           scope.data.query.pages[page].revisions.forEach(function(element){
                               var datetime = (new Date(element.timestamp)).valueOf();
                               var scaler = d3.scale.linear().domain([scale.minDate,scale.maxDate]).range([0,100]);
                               if((scaler(datetime) < timeBounds.maxTime)
                                   && (scaler(datetime) > timeBounds.minTime)){
                                   scope.points.push(scaler(datetime));
                               }
                           });
                       }
                   }
                   scope.render();
               }

               scope.$watch('data',scope.filter);

               scope.render = function(){
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
                       .data(scope.points);
                   p
                       .attr('cx',function(element) {
                           return element*10;
                       });
                   p
                       .enter()
                       .append('circle')
                       .attr('cx',function(element) {
                           return element*10;
                       })
                       .attr('cy',50)
                       .attr('r', 3)
                       .attr('fill','red');

                   p
                       .exit()
                       .remove();


               };

           }
       }
    }]);