'use strict';

//Teststeps service used for teststeps REST endpoint
angular.module('irontest').factory('Teststeps', ['$resource',
  function($resource) {
    return $resource('api/testcases/:testcaseId/teststeps/:teststepId', {
      testcaseId: '@testcaseId', teststepId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);