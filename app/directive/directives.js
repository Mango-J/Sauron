angular.module('Sauron.directive', [])

.directive('gaugeValue', [
  '$compile',
  '$rootScope',
  function($compile, $rootScope){
    return {
      restrict: 'A',
      scope: {
        val: '=',
        chartId: '=id'
      },
      link: function(scope, element, attrs){
        scope.$watch('val', function (newVal, oldVal) {
          // if 'val' is undefined or no changes, exit
          if (angular.isUndefined(newVal)) {
            return;
          }
          if($rootScope.hasOwnProperty(attrs.id)){
            $rootScope[attrs.id].push(newVal);
          } else {
            $rootScope[attrs.id] = angular.element(element[0]).epoch({
              type: 'time.gauge',
              value: newVal,
              queueSize: 120
            });
          }
        });
        $compile(element.contents())(scope);
      }
    }
}])

.directive('barChart', [
  '$compile',
  '$rootScope',
  'dateFilter',
  function($compile, $rootScope, dateFilter){
    var next_color = function(previous_color){
      if(angular.isUndefined(previous_color)){
        return "layer category1";
      }
      var new_color_value = (previous_color[previous_color.length - 1] % 9) + 1;
      return "layer category" + new_color_value;
    };
    return {
      restrict: 'A',
      scope: {
        val: '=',
        chartId: '=id'
      },
      link: function(scope, element, attrs){
        scope.$watch('val', function (newVal, oldVal) {
          // if 'val' is undefined or no changes, exit
          if (angular.isUndefined(newVal)) {
            return;
          }
          //process running_frameworks
          //its a dict: f_id -> framework_details
          current_time = Math.floor((new Date()).getTime() / 1000);

          if($rootScope.hasOwnProperty(attrs.id)){
            var dataset = $rootScope[attrs.id].data; // current data set in chart instance

            // clean up old data
/*            var time_ = dateFilter(current_time * 1000, 'mm');*/
            //if(time_[time_.length - 1] == '5'){
             //// remove old data every 5 mins
              //var i = dataset.length;
              //while(i--){
                //var dataset_values = dataset[i].values;
                //if(dataset_values[0]['y'] == 0 && dataset_values[dataset_values.length - 1]['y'] == 0 ){
                  //dataset.splice(i, 1);
                //}
              //}
            /*}*/

            //$rootScope[attrs.id].push(newVal);
            var new_data_set = [];
            angular.forEach(dataset, function(previous_framework){
              var new_y = 0;
              if(newVal.hasOwnProperty(previous_framework['f_id'])){
                // this previous running framework is still running
                new_y = newVal[previous_framework['f_id']]['tasks'].length;
                newVal[previous_framework['f_id']]['marked'] = true;
              }
              new_data_set.push({
                time: current_time,
                y: new_y
              });
            });
            // iterate through all current running frameworks
            // only add new frameworks
            angular.forEach(newVal, function(framework_detail, framework_id){
              if(angular.isUndefined(framework_detail['marked'])){
                // this framework is new
                // decide what color to use
                var bar_color = '';
                if(angular.isUndefined(dataset) || dataset.length == 0){
                  bar_color = next_color(undefined);
                } else {
                  bar_color = next_color(dataset[dataset.length - 1]['className']);
                }

                // this is only pushing data type
                dataset.push({
                  className: bar_color,
                  values: [{
                    time: current_time,
                    y: 0
                  }],
                  f_id: framework_id
                });

                // this is actually pushing data
                new_data_set.push({
                  time: current_time,
                  y: framework_detail['tasks'].length
                });
              }
            });

            //console.log(dataset.length);
            console.log(dataset);
            //console.log(new_data_set.length);
            console.log(new_data_set)
            $rootScope[attrs.id].push(new_data_set);
          } else if(Object.keys(newVal).length != 0){
            var barchart_data = [];
            angular.forEach(newVal, function(framework_detail, framework_id){
                barchart_data.push({
                  values: [{time: current_time, y: framework_detail['tasks'].length}],
                  f_id: framework_id
                });
            });

            console.log(barchart_data);
            $rootScope[attrs.id] = angular.element(element[0]).epoch({
              type: 'time.bar',
              data: barchart_data,
              axes: ['left', 'bottom', 'right'],
              historySize: 240,
              windowSize: 60,
              queueSize: 120
            });
          }
        });
        $compile(element.contents())(scope);
      }
    }
}]);
