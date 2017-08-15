
function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }

  return a;
}

function MLMenu(el, options) {
  this.el = el;
  this.options = options;

  extend(this.options, options);

  // menus
  this.menus = [].slice.call(this.el.querySelectorAll(".menu__level"));

  this.current = 0;

  this._init();
}

MLMenu.prototype.options = {
  // show breadcrumbs
  breadcrumbsCtrl: true,

  // initial breadcrumb text
  initialBreadcrumb: "all",

  // show back button
  backCtrl: true,

  // delay between each menu item sliding animation
  itemsDelayInterval: 60,

  // direction
  direction: "r2l",

  // callback: item that doesn´t have a submenu gets clicked
  // onItemClick([event], [inner HTML of the clicked item])
  onItemClick: (ev, itemName) => false
};

MLMenu.prototype._init = function() {
  this.menusArr = [];

  var self = this;

  this.menus.forEach((menuEl, pos) => {
    var menu = {
      menuEl: menuEl,
      menuItems: [].slice.call(menuEl.querySelectorAll(".menu__item"))
    };

    self.menusArr.push(menu);

    
  });
};