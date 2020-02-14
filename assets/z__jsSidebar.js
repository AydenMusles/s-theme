"use strict";

Shopify.theme.jsSidebar = {
  init: function init() {
    var $toggleBtn = $('[data-sidebar-block__toggle-icon]');
    var $sidebarContent = $('[data-sidebar-block__content--collapsible]');
    $toggleBtn.on('click', function (e) {
      e.preventDefault();
      var $clickedToggleBtn = $(this);
      var $toggleIcon = $(this).find('.icon');
      var $parentBlock = $clickedToggleBtn.closest('.sidebar__block');
      var $hiddenContent = $parentBlock.find($sidebarContent);

      if ($clickedToggleBtn.hasClass('icon-style--carets')) {
        $toggleIcon.toggleClass('icon--rotate');
      }

      $toggleIcon.toggleClass('icon--active');
      $hiddenContent.toggle();
    });
  },
  unload: function unload() {
    var $toggleBtn = $('[data-sidebar-block__toggle-icon]');
    $toggleBtn.off();
  }
};