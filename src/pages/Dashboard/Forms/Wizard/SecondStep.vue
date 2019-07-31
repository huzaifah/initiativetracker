<template>
  <div>
    <div class="md-layout">
      <md-button class="md-success" @click="displayAddNew()">Add New</md-button>

      <md-dialog :md-active.sync="showDialog" style="width: 70%;">
        <md-dialog-title>Set Target</md-dialog-title>

        <md-dialog-content>
          <md-datepicker v-model="fromModal" md-immediately>
            <label>From date</label>
          </md-datepicker>

          <md-datepicker v-model="toModal" md-immediately>
            <label>To date</label>
          </md-datepicker>

          <md-field>
            <label for="quarter">Quarter</label>
            <md-select v-model="quarter" name="quarter" id="quarter">
              <md-option value="Quarter 1">Quarter 1</md-option>
              <md-option value="Quarter 2">Quarter 2</md-option>
              <md-option value="Quarter 3">Quarter 3</md-option>
              <md-option value="Quarter 4">Quarter 4</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="year">Year</label>
            <md-select v-model="year" name="year" id="year">
              <md-option value="2018">2018</md-option>
              <md-option value="2019">2019</md-option>
              <md-option value="2020">2020</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label>Target</label>
            <md-textarea v-model="target"></md-textarea>
          </md-field>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-danger" @click="showDialog = false">Close</md-button>
          <md-button class="md-success" @click="modalClick()">Save</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-table
        :value="queriedData"
        :md-sort.sync="currentSort"
        :md-sort-order.sync="currentSortOrder"
        :md-sort-fn="customSort"
        class="paginated-table table-striped table-hover"
      >
        <md-table-toolbar>
          <md-field>
            <label for="pages">Per page</label>
            <md-select v-model="pagination.perPage" name="pages">
              <md-option
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              >{{ item }}</md-option>
            </md-select>
          </md-field>

          <md-field>
            <md-input
              type="search"
              class="mb-3"
              clearable
              style="width: 200px"
              placeholder="Search records"
              v-model="searchQuery"
            ></md-input>
          </md-field>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Quarter">{{ item.quarterYear }}</md-table-cell>
          <md-table-cell md-label="From">{{ item.from }}</md-table-cell>
          <md-table-cell md-label="To">{{ item.to }}</md-table-cell>
          <md-table-cell md-label="Target">{{ item.target }}</md-table-cell>

          <md-table-cell md-label="Actions">
            <md-button class="md-just-icon md-warning md-simple" @click.native="handleEdit(item)">
              <md-icon>dvr</md-icon>
            </md-button>
            <md-button class="md-just-icon md-danger md-simple" @click.native="handleDelete(item)">
              <md-icon>close</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-card-actions md-alignment="space-between">
        <div class>
          <p class="card-category">Showing {{ from + 1 }} to {{ to }} of {{ total }} entries</p>
        </div>
        <pagination
          class="pagination-no-border pagination-success"
          v-model="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="total"
        ></pagination>
      </md-card-actions>
    </div>
  </div>
</template>
<script>
//import { IconCheckbox, Modal } from "@/components";
import { Pagination } from "@/components";
import Fuse from "fuse.js";
import Swal from "sweetalert2";
import moment from "moment";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    //IconCheckbox,
    //Modal
    Pagination
  },
  props: {
    record: {
      default: null
    }
  },
  created() {
    if (this.record != null) {
      let index = this.lines.findIndex(line => line.id == this.record.id);

      if (index > -1) this.tableData = this.lines[index].target;
      else this.tableData = [];

      if (this.tableData.length > 0)
        this.itemCount = this.tableData[this.tableData.length - 1].id;
      else this.itemCount = 0;
    }
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapState({
      lines: state => state.store.lines
    }),
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    }
  },
  data() {
    return {
      currentSort: "name",
      currentSortOrder: "asc",
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      footerTable: ["Quarter", "From", "To", "Target", "Actions"],
      searchQuery: "",
      propsToSearch: ["quarterYear", "from", "to", "target"],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      showDialog: false,
      fromModal: null,
      toModal: null,
      year: null,
      target: "",
      quarter: null,
      itemId: null,
      payload: null,
      itemCount: null
    };
  },
  methods: {
    ...mapMutations({
      addInitiativeTarget: "store/addInitiativeTarget",
      removeInitiativeTarget: "store/removeInitiativeTarget"
    }),
    displayAddNew() {
      this.fromModal = moment().format("YYYY/MM/DD");
      this.toModal = moment().format("YYYY/MM/DD");
      this.year = null;
      this.target = null;
      this.quarter = null;
      this.itemId = null;
      this.showDialog = true;
    },
    modalClick() {
      this.showDialog = false;

      this.payload = {
        initiativeId: this.record.id,
        quarterYear: `${this.quarter} ${this.year}`,
        quarter: this.quarter,
        year: this.year,
        from: moment(this.fromModal).format("D MMM YYYY"),
        to: moment(this.toModal).format("D MMM YYYY"),
        target: this.target
      };

      if (this.itemId == null) {
        this.itemId = this.itemCount + 1;
      }

      this.payload.id = this.itemId;

      this.addInitiativeTarget(this.payload);
      this.itemCount = this.payload.id;

      let index = this.lines.findIndex(line => line.id == this.record.id);
      this.tableData = this.lines[index].target;

      this.$emit("on-save");
    },
    validate() {
      this.$emit("on-validated", true, this.model);

      return Promise.resolve(true);
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    handleLike(item) {
      Swal.fire({
        title: `You liked ${item.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "md-button md-success"
      });
    },
    handleEdit(item) {
      this.quarter = item.quarter;
      this.year = item.year;
      this.fromModal = moment(item.from, "D MMM YYYY").format("YYYY/MM/DD");
      this.toModal = moment(item.to, "D MMM YYYY").format("YYYY/MM/DD");
      this.target = item.target;
      this.itemId = item.id;
      this.showDialog = true;
    },
    handleDelete(item) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success btn-fill",
        cancelButtonClass: "md-button md-danger btn-fill",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteRow(item);
          Swal.fire({
            title: "Deleted!",
            text: `You deleted ${item.quarter}`,
            type: "success",
            confirmButtonClass: "md-button md-success btn-fill",
            buttonsStyling: false
          });
        }
      });
    },
    deleteRow(item) {
      let indexToDelete = this.tableData.findIndex(
        tableRow => tableRow.id === item.id
      );

      if (indexToDelete >= 0) {
        this.payload = this.tableData[indexToDelete];
        this.payload.initiativeId = this.record.id;

        this.removeInitiativeTarget(this.payload);
      }
      this.$emit("on-save");
    }
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["quarterYear", "target"],
      threshold: 0.3
    });
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    }
  }
};
</script>
<style></style>
