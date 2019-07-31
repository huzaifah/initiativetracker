<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Report - Initiative</h4>
        </md-card-header>
        <md-card-content>
          <JqxGrid
            ref="grid"
            :width="getWidth"
            :source="dataAdapter"
            :columns="columns"
            :columnsresize="true"
            :pageable="true"
            :groupable="true"
            :sortable="true"
            :filterable="true"
            :altrows="true"
            :autoshowfiltericon="true"
            :filtermode="'excel'"
            :groups="['year']"
          ></JqxGrid>
        </md-card-content>
        <md-card-actions md-alignment="left">
          <JqxButton @click="excelBtnOnClick()">Export to Excel</JqxButton>
          <JqxButton @click="clearFiltering()">Remove Filter</JqxButton>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>
<script>
import JqxBarGauge from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbargauge.vue";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid";
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons";

import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    //JqxBarGauge,
    JqxGrid,
    JqxButton
  },
  computed: {
    ...mapState({
      tableData: state => state.store.lines
    })
  },
  data: function() {
    return {
      //values: [10, 20, 30, 40, 50],
      getWidth: "100%",
      dataAdapter: new jqx.dataAdapter(this.source),
      columns: [
        { text: "Year", datafield: "year", width: "10%" },
        { text: "Strategy", datafield: "strategy", width: "30%" },
        { text: "Sector", datafield: "sector", width: "30%" },
        { text: "Status", datafield: "status", width: "30%" }
      ]
    };
  },
  beforeCreate: function() {
    // Add here any data where you want to transform before components be rendered
    this.source = {
      datatype: "array",
      datafields: [
        { name: "year", type: "string" },
        { name: "strategy", type: "string" },
        { name: "sector", type: "string" },
        { name: "status", type: "string" }
      ],
      id: "id"
    };
  },
  created: function() {
    this.source.localdata = this.tableData;
    //this.$refs.grid.updatebounddata();
  },
  methods: {
    formatFunction: function(value, index, color) {
      return color;
    },
    onPageChanged: function() {
      let info = this.$refs.grid.getpagingininformation();
      alert(info);
    },
    excelBtnOnClick: function() {
      this.$refs.grid.exportdata("xls", "initiative-list");
    },
    clearFiltering: function() {
      this.$refs.grid.clearfilters();
    }
  }
};
</script>
<style lang="scss" scoped>
.md-card .md-card-actions {
  border: none;
}

.md-inline-checkboxes {
  display: inline-flex;

  .md-checkbox {
    margin-top: 15px !important;
  }
}

.md-checkbox,
.md-radio {
  margin-top: 15px;
  margin-bottom: 0.5rem;
}

.md-checkbox,
.md-radio {
  display: flex;
}

.md-radio /deep/ .md-radio-container {
  margin-left: 5px;
  position: relative;
  left: -3px;
}

.md-form-label + .md-layout-item .md-checkbox:not(:first-child),
.md-form-label + .md-layout-item + .md-layout-item .md-radio:not(:first-child),
.md-form-label + .md-layout-item .md-radio {
  margin-top: 0;
}

.form-control-static {
  margin-top: 6px;
}
</style>
