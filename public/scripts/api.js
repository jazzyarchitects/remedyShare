/**
 * Created by Jibin_ism on 30-Dec-15.
 */
"use strict";


function apiAjax(options) {
    var processData = true;
    var contentType = options.contentType || 'application/x-www-form-urlencoded; charset=utf-8';

    if (!options.method) {
        options.method = 'GET';
    }

    var preExecute = options.preExecute || function (a) {

        };

    var host, protocol;
    protocol = window.location.protocol;
    host = window.location.host;

    var url = protocol + "//" + host + "/api" + options.url;
    if (!url) {
        return false;
    }

    var data = options.data || {};
    var success = options.success || function (a) {
            //console.log(a);
        };
    var error = options.error || function (a) {
            //console.log(a);
        };

    var async = options.async;
    if (!async) {
        async = true;
    }

    if (options.processData !== undefined) {
        processData = options.processData;
    }

    if (options.contentType !== undefined) {
        contentType = options.contentType;
    }

    var userCookie;
    try {
        userCookie = JSON.parse($.cookie("user"));
    } catch (err) {
        userCookie = null;
    }

    $.ajax({
        url: url,
        type: options.method,
        async: async,
        data: data,
        processData: processData,
        contentType: contentType,
        beforeSend: function (request) {
            request.setRequestHeader("x-service-id", 'webApp1958-2013@ISM');
            if (userCookie) {
                request.setRequestHeader("x-access-key", userCookie.key);
                request.setRequestHeader("x-access-id", userCookie.id);
            }
            preExecute();
        },
        success: function (response) {
            if (response.success) {
                success(response);
            } else if (error) {
                error(response);
            }
        },
        error: function (result) {
            //console.log("Error api: "+JSON.stringify(result));
            error(result);
        }
    });
}

if (typeof module != 'undefined') {
    module.exports = apiAjax;
}