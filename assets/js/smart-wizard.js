(function ($) {

    $.fn.sw = function (options) {
        options = $.extend({
            nextText: 'Növbəti',
            prevText: 'Öncəki',
            acceptText: 'Təsdiqlə',
            cancelText: 'İmtina',
            toolbarMode: 'both' // top, bottom
        }, options);

        $.each(this, function (index, item) {
            let wizard = $(item).addClass('smart-wizard');
            let tabs = $('<ul></ul>').addClass('smart-tabs');
            let wizardContainer = $('<div></div>').addClass('smart-container');

            $(item).find('> [aria-step-title]').each(function (pageIndex, page) {
                let li = $(`<li>
                                <a href="#step-${pageIndex + 1}" class="smart-link">${$(page).attr('aria-step-title')}<br>
                                    <small>${$(page).attr('aria-step-description')}</small>
                                </a>
                            </li>`).addClass('smart-item');

                page = $(page).addClass('smart-page').attr('id', `step-${pageIndex + 1}`);

                if (pageIndex == 0) {
                    $(li).addClass('active');
                    $(page).addClass('active');
                }
                $(tabs).append(li);
                $(wizardContainer).append(page);


                $(page).removeAttr('aria-step-title').removeAttr('aria-step-description');
            });

            $(tabs).find('.smart-link').click(function (e) {
                e.preventDefault();

                $(tabs).find('.smart-item').removeClass('done').removeClass('error');

                if ($(e.currentTarget).closest('li').hasClass('active'))
                    return;


                let stepHref = $(e.currentTarget).attr('href');

                if (options.onNext && typeof options.onNext == 'function') {

                    e.referanceNext = stepHref;
                    e.referanceNextId = stepHref.replace('#step-', '');
                    if (isNaN(e.referanceNextId))
                        e.referanceNextId = -1;

                    let active = $(tabs).find('.smart-item.active > .smart-link')[0];
                    if (active != undefined) {
                        e.referanceCurrent = $(active).attr('href');
                        e.referanceCurrentId = e.referanceCurrent.replace('#step-', '');
                        if (isNaN(e.referanceCurrentId))
                            e.referanceCurrentId = -1;
                    }
                    if (e.referanceCurrentId < e.referanceNextId) {
                        let resultFromDelegate = options.onNext(e);

                        if (resultFromDelegate == false) {
                            $(tabs).find('.active').addClass('error');
                            return;
                        }
                    }
                }

                if (/#\w+-\d+/g.test(stepHref)) {
                    for (let i = 1; i < parseInt(stepHref.replace('#step-', '')); i++) {
                        $(tabs).find(`.smart-item:nth-child(${i})`).addClass('done');
                    }
                }

                $(e.currentTarget).closest('.smart-tabs').find('.smart-item').removeClass('active');
                $(wizardContainer).find('.smart-page').removeClass('active');

                $(e.currentTarget).closest('li').addClass('active');
                $(wizardContainer).find(`${$(e.currentTarget).attr('href')}`).addClass('active');
            });

            let toolbar = $('<div></div>').addClass('smart-toolbar');
            let prevButton = $('<button></button>', {
                html: options.prevText,
                type: 'button',
                'aria-wizard-action': 'prev'
            });

            $(prevButton).click(function (e) {
                $(tabs).find('.active').prev()
                    .find('.smart-link').click();
            });

            $(toolbar).append(prevButton);

            let nextButton = $('<button></button>', {
                html: options.nextText,
                type: 'button',
                'aria-wizard-action': 'next'
            });

            $(nextButton).click(function (e) {
                $(tabs).find('.active').next()
                    .find('.smart-link').click();
            });

            $(toolbar).append(nextButton);

            let cancelButton = $('<button></button>', {
                html: options.cancelText,
                type: 'button',
                'aria-wizard-action': 'cancel'
            });

            if (options.onCancel && typeof options.onCancel == 'function')
                $(cancelButton).click(options.onCancel);

            $(toolbar).append(cancelButton);

            let acceptButton = $('<button></button>', {
                html: options.acceptText,
                type: 'button',
                'aria-wizard-action': 'accept'
            });

            if (options.onAccept && typeof options.onAccept == 'function')
                $(acceptButton).click(options.onAccept);

            $(toolbar).append(acceptButton);

            $(wizard).append(tabs);


            if (options.toolbarMode == 'both' || options.toolbarMode == 'top')
                $(wizard).append(toolbar);

            $(wizard).append(wizardContainer);

            if (options.toolbarMode == 'both' || options.toolbarMode == 'bottom')
                $(wizard).append($(toolbar).clone(true));

        });

        return this;
    }

})(jQuery);

