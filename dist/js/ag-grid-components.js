// 自定义筛选
function PersonFilter() {
}

PersonFilter.prototype.init = function (params) {
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.params = params;
    this.setupGui();
};

// not called by ag-Grid, just for us to help setup
PersonFilter.prototype.setupGui = function () {
    this.gui = document.createElement('div');
    this.gui.innerHTML =
        '<div style="padding: 4px;">' +
        '<div style="font-weight: bold;">请输入查询内容</div>' +
        '<div class="ag-input-text-wrapper"><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="请输入搜索内容"/></div>' +
        '</div>';

    var that = this;
    this.onFilterChanged = function () {
        that.extractFilterText();
        that.params.filterChangedCallback();
    };

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener("input", this.onFilterChanged);
};

PersonFilter.prototype.extractFilterText = function () {
    this.filterText = this.eFilterText.value;
};

PersonFilter.prototype.getGui = function () {
    return this.gui;
};

PersonFilter.prototype.doesFilterPass = function (params) {
    // make sure each word passes separately, ie search for firstname, lastname
    var passed = true;
    var valueGetter = this.valueGetter;
    this.filterText.toLowerCase().split(" ").forEach(function (filterWord) {
        var value = valueGetter(params);
        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
            passed = false;
        }
    });

    return passed;
};

PersonFilter.prototype.isFilterActive = function () {
    var isActive = this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
    return isActive;
};

PersonFilter.prototype.getModelAsString = function (model) {
    return model ? model : '';
};

PersonFilter.prototype.getModel = function () {
    return this.eFilterText.value;
};

// lazy, the example doesn't use setModel()
PersonFilter.prototype.setModel = function (model) {
    this.eFilterText.value = model;
    this.extractFilterText();
};

PersonFilter.prototype.destroy = function () {
    this.eFilterText.removeEventListener("input", this.onFilterChanged);
};

// 搜索框
function PersonFloatingFilterComponent() {
}

PersonFloatingFilterComponent.prototype.init = function (params) {
    this.params = params;
    var eGui = this.eGui = document.createElement('div');
    eGui.className = 'ag-input-text-wrapper';
    var input = this.input = document.createElement('input');
    input.className = 'ag-floating-filter-input';
    eGui.appendChild(input);
    this.changeEventListener = function () {
        params.onFloatingFilterChanged(input.value);
    };
    input.addEventListener('input', this.changeEventListener);
};

PersonFloatingFilterComponent.prototype.getGui = function () {
    return this.eGui;
};

PersonFloatingFilterComponent.prototype.onParentModelChanged = function (model) {
    // add in child, one for each flat
    this.input.value = model != null ? model : '';
};

PersonFloatingFilterComponent.prototype.destroy = function () {
    this.input.removeEventListener('input', this.changeEventListener);
};

// 行内select
