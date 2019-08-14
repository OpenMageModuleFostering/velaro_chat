/**
 * Velaro
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category    Velaro
 * @package     Velaro_Chat
 * @copyright   Copyright (c) 2015 Velaro (http://www.velaro.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

(function () {

    document.observe('dom:loaded', function () {
        var baseUrl = $$('[name=velarobaseurl]')[0].value;
        var setupVelaroSelects = function () {
            var selectMappings = {
                velaro_enabled: 'velaro-enabled',
                velaro_visitor_monitoring: 'velaro-visitor-monitoring'
            };
            var keys = Object.keys(selectMappings);

            keys.each(function (key) {
                //setup initial values
                var value = $$('[name=' + key + ']')[0].value;
                $$('[name=' + selectMappings[key] + '] option').each(function (el) {
                    el.writeAttribute('selected', false);
                });
                if(value){
                    $$('[name=' + selectMappings[key] + '] option[value="' + value + '"]')[0].writeAttribute('selected', true);   
                }

                //setup change events
                var $select = $$('[name=' + selectMappings[key] + ']')[0];
                $select.stopObserving('change');
                $select.on('change', function (e) {
                    var currentValue = $$('[name=' + selectMappings[key] + '] option:selected')[0].value;
                    $$('[name=' + key + ']')[0].writeAttribute('value', currentValue);
                });
            });

        };
        var matchVelaroGroup = function () {
            var pageID = $$('.velaro-page-select option:selected')[0].value;
            var val = $$('[name=velaro_page_assignments]')[0].value;
            var currentAssingments = val ? JSON.parse(val) : {};
            var pageAssignment = currentAssingments['page_' + pageID];
            if (pageAssignment) {
                $$(".velaro-group-select option:selected")[0].writeAttribute("selected", false);
                $$('.velaro-group-select option[value="' + pageAssignment + '"]')[0].writeAttribute("selected", true);
            } else {
                $$(".velaro-group-select option:selected")[0].writeAttribute("selected", false);
                $$('.velaro-group-select option[value="0"]')[0].writeAttribute("selected", true);
            }
        };
        // when the group select changes, set the value that will be saved in our plugins options
        $$('.velaro-group-select')[0].stopObserving('change');
        $$('.velaro-group-select')[0].on('change', function (e) {
            var pageID = $$('.velaro-page-select option:selected')[0].value;
            var val = $$('[name=velaro_page_assignments]')[0].value;
            var currentAssingments = val ? JSON.parse(val) : {};
            currentAssingments['page_' + pageID] = $$('.velaro-group-select option:selected')[0].value;
            $$('[name=velaro_page_assignments]')[0].writeAttribute('value', JSON.stringify(currentAssingments));
        });
        // when the page select changes, set the group select to the correct value
        $$('.velaro-page-select')[0].stopObserving('change');
        $$('.velaro-page-select')[0].on('change', function (e) {
            matchVelaroGroup();
        });
        // on click link, fire request to velaro to get the site identifier/api key for this login, will be stored in our options
        $('velaro_attach').stopObserving('click');
        $('velaro_attach').on('click', function () {
            var userName = $$('[name=velaro_username]')[0].value;
            var password = $$('[name=velaro_password]')[0].value;
            var model = {
                UserName: userName,
                Password: password
            };
            var request = new Ajax.Request(baseUrl + '/api/plugins/login',
            {
                method: 'post',
                parameters: JSON.stringify(model),
                contentType: 'application/json',
                dataType: 'json',
                onSuccess: function (response) {
                    if (response.status == 200) {
                        var start = response.responseText.indexOf('<Content>') + 9;
                        var end = response.responseText.indexOf('</Content>');
                        var data = JSON.parse(response.responseText.substring(start, end));
                        $$('[name=velaro_site_identifier]')[0].setValue(data.Identifier);
                        $$('[name=velaro_api_key]')[0].setValue(data.ApiKey);
                    } else {
                        $$('[name=velaro_site_identifier]')[0].setValue('');
                        $$('[name=velaro_api_key]')[0].setValue('');
                    }
                    $$('[name=velaro_submit]')[0].click();
                }
            });
        });
        matchVelaroGroup();
        setupVelaroSelects();

        // stop enter from submitting form since we also have a link button
        $$('input').forEach(function (input) {
            input.on('keypress', function (event) {
                var key = event.which || event.keyCode;
                if (key === Event.KEY_RETURN) Event.stop(event)
            });
        });
    })


})();