$( document ).ready(function() {
    $('.favorite').click(favorite);
    $('.nav-mobile').click(mobileMenu);
    $('.sub-open').click(subMenu);
    $('.object-type').click(objectTypeChange);
    $('.clear').click(clearFilter);
    $('.btn-filter').click(filter);
    $('.btn-more').click(setTake);
    $('.close-notice').click(closeNotice);
    $('.btn-object').click(objectOrder);

    phoneMask(document.getElementById('contact-phone'));

    var elms = document.querySelectorAll('.slider');
    for (var i = 0, len = elms.length; i < len; i++) {
        // инициализация elms[i] в качестве слайдера
        new ChiefSlider(elms[i]);
    }

    $('.parent-container').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        },
    });
});

function objectOrder() {
    localStorage.objectorder = $(this).attr('data-object')
}

function closeNotice() {
    $('.send-success').removeClass('animate__fadeInDown');
    $('.send-success').addClass('animate__fadeOutRight');
    setTimeout(function () {
        $('.send-success').removeClass('animate__fadeOutRight');
        $('.send-success').addClass('hide');
        $('.send-success').addClass('animate__fadeInDown');
    }, 500)
}

function setTake(event) {
    event.preventDefault()

    $.ajax({
        type: 'POST',
        url: '/take-set',
        data: {add: 4},
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        success: function() {
            location.reload();
        }
    });
}

function filter(event) {
    event.preventDefault()

    $.ajax({
        type: 'POST',
        url: '/filter-set',
        data: {
            price: $('#price').val(),
            area_house: $('#area_house').val(),
            area_land: $('#area_land').val()
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        success: function() {
            location.reload();
        }
    });
}

function clearFilter() {
    $.ajax({
        type: 'POST',
        url: '/filter-clear',
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        success: function() {
            location.reload();
        }
    });
}

function favorite() {
    let action = ''

    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
        action = 'delete'
    } else {
        $(this).addClass('active')
        action = 'add'
    }

    let id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: '/favorite-set',
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        data: {id: id, action: action},
        success: function(response) {
            console.log(response)
        }
    });
}

function objectTypeChange() {
    $('.object-type').removeClass('active')
    $(this).addClass('active')

    let type = ''

    if ($(this).hasClass('land')) {
        type = 'land'
    } else if ($(this).hasClass('house')) {
        type = 'house'
    }

    $.ajax({
        type: 'POST',
        url: '/type-set',
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        data: {type: type},
        success: function() {
            //window.location.href = '/';
            location.reload();
        }
    });
}

function subMenu() {
    if ($(".sub").hasClass('open')) {
        $(".sub").slideUp(400)
        $(".sub").removeClass('open')
    } else {
        $(".sub").slideDown(400)
        $(".sub").addClass('open')
    }
}

function mobileMenu() {
    let menu = $('.mobile-menu')

    if (menu.hasClass('hide')) {
        menu.removeClass('hide')
    } else {
        if (menu.hasClass('animate__fadeInRight')) {
            menu.removeClass('animate__fadeInRight')
            menu.addClass('animate__fadeOutRight')
        } else if (menu.hasClass('animate__fadeOutRight')) {
            menu.removeClass('animate__fadeOutRight')
            menu.addClass('animate__fadeInRight')
        }
    }
}

if (window.innerWidth > 600) {
    $('#exampleModal').on('show.bs.modal', function () {
        $('.nav').attr('style', 'padding-right: 17px');
        $('#popup__toggle').attr('style', 'right: 27px; transition: none;');
    })
    $('#exampleModal').on('hidden.bs.modal', function () {
        $('.nav').attr('style', '');
        $('#popup__toggle').attr('style', 'transition: none;');
        setTimeout(function () {
            $('#popup__toggle').attr('style', '');
        }, 500)
    })
}

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    //закрываем мобильное меню
    if (!$('.mobile-menu').hasClass('hide')) {
        $('.nav-mobile').click();
    }

    $('html, body').stop().animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 40
    }, 10, 'easeInOutExpo');
});

function phoneMask(phone) {
    var patternMask = new IMask(phone, {
        mask: '+{7} (000) 000-00-00',
        lazy: true,  // make placeholder always visible
        placeholderChar: '_'     // defaults to '_'
    });
    phone.addEventListener('focus', function() {
        patternMask.updateOptions({ lazy: false });
    }, true);
    phone.addEventListener('blur', function() {
        patternMask.updateOptions({ lazy: true });
        // NEXT IS OPTIONAL
        if (!patternMask.masked.rawInputValue) {
            patternMask.value = '';
        }
    }, true);
    phone.addEventListener('click', function() {
        if (localStorage.hasOwnProperty('mask')) {
            patternMask.value = '';
        }
    }, true);
}

function sendEmail(formId) {

    let name = ''
    let phone = ''
    let email = ''
    let message = ''

    if (formId == 'contact-form') {
        name = $('#contact-name').val()
        phone = $('#contact-phone').val()
        email = $('#contact-email').val()
        message = $('#contact-message').val()
    } else if (formId == 'contact-form2') {
        name = $('#contact-name2').val()
        phone = $('#contact-phone2').val()
        email = ''
        message = ''
        $('.btn-close').click()
    }
    $('.send-success').removeClass('hide')

    //очищаем форму
    localStorage.mask = 1
    $('#contact-phone').click()
    $('#contact-phone2').click()
    localStorage.removeItem('mask');
    $('#contact-form')[0].reset();
    $('#contact-form2')[0].reset();

    $.ajax({
        type: 'POST',
        url: '/mail',
        data: {name: name, phone: phone, email: email, message: message},
        headers: {
            'X-CSRF-TOKEN': $('meta[name = "csrf-token"]').attr('content')
        },
        success: function() {
            setTimeout(closeNotice, 5000)
        }
    });
}

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()

                    form.classList.add('was-validated')
                    if (window.innerWidth > 600) {
                        $('#contact-message').height('222');
                    }
                } else {
                    event.preventDefault()

                    form.classList.remove('was-validated')
                    if (window.innerWidth > 600) {
                        $('#contact-message').height('171');
                    }

                    sendEmail(form.id)
                }

            }, false)
        })
})()
