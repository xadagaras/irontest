'use strict';

//  if unspecified, all grid config is for the assertions grid
angular.module('iron-test').controller('AssertionsController', ['$scope', 'Assertions',
    '$stateParams', 'uiGridConstants', 'uiGridEditConstants', '$timeout', 'IronTestUtils', '$http',
  function($scope, Assertions, $stateParams, uiGridConstants, uiGridEditConstants, $timeout, IronTestUtils, $http) {
    //  use assertionsModelObj for all variables in the scope, to avoid conflict with parent scope
    $scope.assertionsModelObj = {};

    $scope.assertionsModelObj.tempData = {};

    var timer;
    $scope.assertionsModelObj.autoSave = function(isValid) {
      if (timer) $timeout.cancel(timer);
      timer = $timeout(function() {
        $scope.assertionsModelObj.update(isValid);
      }, 2000);
    };

    $scope.assertionsModelObj.update = function(isValid) {
      if (isValid) {
        $scope.assertionsModelObj.assertion.$update({
          testcaseId: $stateParams.testcaseId,
          teststepId: $stateParams.teststepId
        }, function(response) {
          $scope.$parent.savingStatus.saveSuccessful = true;
          $scope.assertionsModelObj.assertion = response;
        }, function(response) {
          IronTestUtils.openErrorHTTPResponseModal(response);
        });
      } else {
        $scope.$parent.savingStatus.submitted = true;
      }
    };

    //  remove currently selected assertion
    var removeCurrentAssertion = function(gridMenuEvent) {
      var currentAssertion = $scope.assertionsModelObj.assertion;
      if (currentAssertion) {
        currentAssertion.$remove({
          testcaseId: $stateParams.testcaseId,
          teststepId: $stateParams.teststepId
        }, function(response) {
          //  delete the assertion from the grid
          IronTestUtils.deleteArrayElementByProperty($scope.assertionsModelObj.assertions, 'id', currentAssertion.id);

          //  set current assertion to null
          $scope.assertionsModelObj.assertion = null;
        }, function(response) {
          IronTestUtils.openErrorHTTPResponseModal(response);
        });
      }
    };

    $scope.assertionsModelObj.gridOptions = {
      data: 'assertionsModelObj.assertions',
      enableRowHeaderSelection: false, multiSelect: false, noUnselect: true, enableGridMenu: true,
      enableColumnMenus: false,
      columnDefs: [
        {
          name: 'name', width: 260, minWidth: 260, headerTooltip: 'Double click to edit',
          sort: { direction: uiGridConstants.ASC, priority: 1 }, cellTemplate: 'assertionGridNameCellTemplate.html',
          enableCellEdit: true, editableCellTemplate: 'assertionGridNameEditableCellTemplate.html'
        },
        { name: 'type', width: 80, minWidth: 80, enableCellEdit: false }
      ],
      gridMenuCustomItems: [
        { title: 'Delete', order: 210, action: removeCurrentAssertion }
      ],
      onRegisterApi: function (gridApi) {
        $scope.assertionsModelObj.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          $scope.assertionsModelObj.assertion = row.entity;
        });
      }
    };

    $scope.assertionsModelObj.findAll = function() {
      Assertions.query(
        {
          testcaseId: $stateParams.testcaseId,
          teststepId: $stateParams.teststepId
        }, function(response) {
          $scope.assertionsModelObj.assertions = response;
        }, function(response) {
          IronTestUtils.openErrorHTTPResponseModal(response);
        });
    };

    var createAssertion = function(assertion) {
      assertion.$save({
        testcaseId: $stateParams.testcaseId,
        teststepId: $stateParams.teststepId
      }, function(response) {
        $scope.assertionsModelObj.assertion = response;
        $scope.assertionsModelObj.assertions.push(response);

        //  select the new assertion in the grid
        $timeout(function() {    //  a trick for newly loaded grid data
          $scope.assertionsModelObj.gridApi.selection.selectRow(response);
        });
      }, function(response) {
        IronTestUtils.openErrorHTTPResponseModal(response);
      });
    };

    $scope.assertionsModelObj.createContainsAssertion = function() {
      //  create the assertion
      var assertion = new Assertions({
        teststepId: $stateParams.teststepId,
        name: IronTestUtils.getNextNameInSequence($scope.assertionsModelObj.assertions, 'Contains'),
        type: 'Contains',
        properties: { contains: 'value' }
      });
      createAssertion(assertion);
    };

    $scope.assertionsModelObj.createXPathAssertion = function() {
      var assertion = new Assertions({
        teststepId: $stateParams.teststepId,
        name: IronTestUtils.getNextNameInSequence($scope.assertionsModelObj.assertions, 'XPath'),
        type: 'XPath',
        properties: {
         xPath: 'true()',
         expectedValue: 'true',
         namespacePrefixes: []
        }
      });

      createAssertion(assertion);
    };

    //  update assertion without validating whole form and displaying saving successful message
    var assertionUpdateInBackground = function() {
      $scope.assertionsModelObj.assertion.$update({
        testcaseId: $stateParams.testcaseId,
        teststepId: $stateParams.teststepId
      }, function(response) {
        $scope.assertionsModelObj.assertion = response;
      }, function(response) {
        IronTestUtils.openErrorHTTPResponseModal(response);
      });
    };

    var createNamespacePrefix = function(gridMenuEvent) {
      $scope.assertionsModelObj.assertion.properties.namespacePrefixes.push(
        { prefix: 'ns1', namespace: 'http://com.mycompany/service1' }
      );
      assertionUpdateInBackground();
    };

    var removeNamespacePrefix = function(gridMenuEvent) {
      var selectedRows = $scope.assertionsModelObj.xPathNamespacePrefixGridApi.selection.getSelectedRows();
      var namespacePrefixes = $scope.assertionsModelObj.assertion.properties.namespacePrefixes;
      for (var i = 0; i < selectedRows.length; i += 1) {
        IronTestUtils.deleteArrayElementByProperty(namespacePrefixes, '$$hashKey', selectedRows[i].$$hashKey);
      }
      assertionUpdateInBackground();
    };

    $scope.assertionsModelObj.xPathNamespacePrefixesGridOptions = {
      data: 'assertionsModelObj.assertion.properties.namespacePrefixes',
      enableRowHeaderSelection: false, multiSelect: false, enableGridMenu: true, enableColumnMenus: false,
      rowHeight: 20, enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      columnDefs: [
        {
          name: 'prefix', width: 65, minWidth: 65, headerTooltip: 'Double click to edit',
          sort: { direction: uiGridConstants.ASC, priority: 1 }, enableCellEdit: true,
          editableCellTemplate: 'namespacePrefixGridPrefixEditableCellTemplate.html'
        },
        {
          name: 'namespace', headerTooltip: 'Double click to edit', enableCellEdit: true,
          editableCellTemplate: 'namespacePrefixGridNamespaceEditableCellTemplate.html'
        }
      ],
      gridMenuCustomItems: [
        { title: 'Create', order: 210, action: createNamespacePrefix },
        { title: 'Delete', order: 220, action: removeNamespacePrefix }
      ],
      onRegisterApi: function (gridApi) {
        $scope.assertionsModelObj.xPathNamespacePrefixGridApi = gridApi;
      }
    };

    $scope.assertionsModelObj.verifyCurrentAssertion = function() {
      var assertion = $scope.assertionsModelObj.assertion;
      var url = 'api/jsonservice/verifyassertion';
      var assertionVerification = {
        input: $scope.$parent.tempData.soapResponse,
        assertion: assertion
      };
      $http
        .post(url, assertionVerification)
        .then(function successCallback(response) {
          var data = response.data;
          $scope.assertionsModelObj.assertionVerificationResult = data;

          if (assertion.type === 'XPath') {
            $scope.assertionsModelObj.tempData.assertionXPathActualValue =
              data.error ? data.error : data.actualValue;
            $scope.assertionsModelObj.tempData.assertionXPathActualValueError = data.error;
          }
        }, function errorCallback(response) {
          IronTestUtils.openErrorHTTPResponseModal(response);
        });
    };
  }
]);
