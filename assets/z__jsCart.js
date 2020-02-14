"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Shopify.theme.jsCart = {
  init: function init($section) {
    // Add settings from schema to current object
    //Shopify.theme.jsCart = $.extend(this, Shopify.theme.getSectionData($section));
    this.$section = $section;
    $(document).on('click', '[data-cart-page-delete]', function (e) {
      e.preventDefault();
      var variantId = $(this).data('cart-variant-id');
      Shopify.theme.jsCart.removeFromCart(variantId);
      return false;
    });
  },
  removeFromCart: function removeFromCart(variantId) {
    var $cartItem = Shopify.theme.jsCart.$section.find("[data-cart-variant-id=\"".concat(variantId, "\"]")).parents('.cart__card');
    $cartItem.css('opacity', '0.5');
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=0&id=' + variantId,
      dataType: 'json',
      success: function success(cart) {
        $cartItem.addClass('animated zoomOut').delay(1000).queue(function () {
          $cartItem.addClass('is-hidden'); //@TODO - add nicer animation
        });
        Shopify.theme.jsCart.updateView(cart);
        Shopify.theme.jsAjaxCart.updateView();
      },
      error: function error(XMLHttpRequest, textStatus) {
        var response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;
      }
    });
  },
  updateView: function updateView(cart) {
    var variantId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (cart.item_count > 0) {
      var _$$ajax;

      $.ajax((_$$ajax = {
        dataType: "json",
        async: false,
        cache: false
      }, _defineProperty(_$$ajax, "dataType", 'html'), _defineProperty(_$$ajax, "url", "/cart"), _defineProperty(_$$ajax, "success", function success(html) {
        if (variantId !== null) {
          var itemTotal = $(html).find("[data-cart-item=\"".concat(variantId, "\"]")).find('.cart__total');
          var quantityInput = $(html).find("[data-cart-item=\"".concat(variantId, "\"]")).find('.quantity-input');
          $("[data-cart-item=\"".concat(variantId, "\"]")).find('.cart__total').replaceWith(itemTotal);
          $("[data-cart-item=\"".concat(variantId, "\"]")).find('.quantity-input').replaceWith(quantityInput);
        }

        var savings = $(html).find('.cart__savings');
        var subtotal = $(html).find('.cart__subtotal');
        $('.cart__savings').replaceWith(savings);
        $('.cart__subtotal').replaceWith(subtotal);
        $('[data-bind="itemCount"]').text(cart.item_count);
      }), _$$ajax));
    } else {
      $('.cart__empty-cart-message').removeClass('is-hidden');
      $('.cart__form').addClass('is-hidden');
      $('[data-ajax-cart-trigger]').removeClass('has-cart-count');
      $('[data-bind="itemCount"]').text('0');
    }

    if (Shopify.theme_settings.show_multiple_currencies) {
      convertCurrencies();
    }
  },
  unload: function unload($section) {
    // Clear event listeners in theme editor
    $('[data-cart-page-delete]').off();
  }
};