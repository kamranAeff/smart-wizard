# smart-wizard

<pre>
$(document).ready(function () {
    let swOptions = {};

    swOptions.onCancel = function (e) {
        console.log('onCancel', e);
    };

    swOptions.onAccept = function (e) {
        console.log('onAccept', e);
    };

    swOptions.onNext = function (e) {
        console.log('onNext', e.referanceNext
        , e.referanceNextId
        , e.referanceCurrent
        , e.referanceCurrentId);
        return true;
    };

    $('#wizard1').sw(swOptions);
});
</pre>