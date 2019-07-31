<template>
  <div>
    <div class="md-layout">
      <md-button class="md-success" @click="displayAddNew">Add New</md-button>

      <md-dialog :md-active.sync="showDialog" style="width: 70%;">
        <md-dialog-title>Set Result</md-dialog-title>

        <md-dialog-content>
          <md-datepicker v-model="fromModal" md-immediately>
            <label>From date</label>
          </md-datepicker>

          <md-datepicker v-model="toModal" md-immediately>
            <label>To date</label>
          </md-datepicker>

          <md-field>
            <label>Accumulated Actual</label>
            <md-textarea v-model="accumulatedActual"></md-textarea>
          </md-field>

          <md-field>
            <label>Status</label>
            <md-textarea v-model="status"></md-textarea>
          </md-field>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-danger" @click="showDialog = false">Close</md-button>
          <md-button class="md-success" @click="modalClick">Save</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-table
        :value="queriedResult"
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
          <md-table-cell md-label="From">{{ item.from }}</md-table-cell>
          <md-table-cell md-label="To">{{ item.to }}</md-table-cell>
          <md-table-cell md-label="Accumulated Actual">{{ item.accumulatedActual }}</md-table-cell>
          <md-table-cell md-label="Status/Remark">{{ item.status }}</md-table-cell>

          <md-table-cell md-label="Actions">
            <md-button
              class="md-just-icon md-warning md-simple"
              @click.native="handleEditResult(item)"
            >
              <md-icon>dvr</md-icon>
            </md-button>
            <md-button
              class="md-just-icon md-danger md-simple"
              @click.native="handleDeleteResult(item)"
            >
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
//import { IconCheckbox } from "@/components";
import { Pagination } from "@/components";
//import results from "./results";
import Fuse from "fuse.js";
import Swal from "sweetalert2";
import moment from "moment";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    //IconCheckbox
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

      if (index > -1)
        this.resultData = this.lines[index].result;
      else
        this.resultData = [];

      if (this.resultData.length > 0)
        this.itemCount = this.resultData[this.resultData.length - 1].id;
      else
        this.itemCount = 0;
    }
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    ...mapState({
      lines: state => state.store.lines
    }),
    queriedResult() {
      let result = this.resultData;
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
        : this.resultData.length;
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
      propsToSearch: ["from", "to", "accumulatedActual"],
      resultData: [],
      searchedData: [],
      fuseSearch: null,
      showDialog: false,
      fromModal: null,
      toModal: null,
      accumulatedActual: null,
      status: null,
      itemId: null,
      payload: null,
      itemCount: null
    };
  },
  methods: {
    ...mapMutations({
      addInitiativeResult: "store/addInitiativeResult",
      removeInitiativeResult: "store/removeInitiativeResult"
    }),
    displayAddNew() {
      this.fromModal = moment().format("YYYY/MM/DD");
      this.toModal = moment().format("YYYY/MM/DD");
      this.accumulatedActual = "";
      this.status = "";
      this.itemId = null;
      this.showDialog = true;
    },
    validate() {
      this.$emit("on-validated", true, this.model);

      return Promise.resolve(true);
    },
    modalClick() {
      this.showDialog = false;

      this.payload = {
        initiativeId: this.record.id,
        from: moment(this.fromModal).format("D MMM YYYY"),
        to: moment(this.toModal).format("D MMM YYYY"),
        accumulatedActual: this.accumulatedActual,
        status: this.status
      };

      if (this.itemId == null) {
        this.itemId = this.itemCount + 1;
      }
      
      this.payload.id = this.itemId;

      this.addInitiativeResult(this.payload);
      this.itemCount = this.payload.id;

      let index = this.lines.findIndex(line => line.id == this.record.id);
      this.resultData = this.lines[index].result;

      console.log("Result ", this.resultData);

      // if (this.itemId == null) {
      //   this.resultData.push({
      //     id: this.resultData.length + 1,
      //     from: moment(this.fromModal).format("D MMM YYYY"),
      //     to: moment(this.toModal).format("D MMM YYYY"),
      //     accumulatedActual: this.accumulatedActual,
      //     status: this.status
      //   });
      // } else {
      //   let indexToUpdate = this.resultData.findIndex(
      //     tableRow => tableRow.id === this.itemId
      //   );

      //   if (indexToUpdate >= 0) {
      //     this.resultData.splice(indexToUpdate, 1);
      //   }

      //   this.resultData.push({
      //     id: this.itemId,
      //     from: moment(this.fromModal).format("D MMM YYYY"),
      //     to: moment(this.toModal).format("D MMM YYYY"),
      //     accumulatedActual: this.accumulatedActual,
      //     status: this.status
      //   });
      // }

      this.$emit("on-save");
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
    handleEditResult(item) {
      this.fromModal = moment(item.from, "D MMM YYYY").format("YYYY/MM/DD");
      this.toModal = moment(item.to, "D MMM YYYY").format("YYYY/MM/DD");
      this.accumulatedActual = item.accumulatedActual;
      this.status = item.status;
      this.itemId = item.id;
      this.showDialog = true;
    },
    handleDeleteResult(item) {
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
          this.deleteResult(item);
          Swal.fire({
            title: "Deleted!",
            text: `You deleted ${item.accumulatedActual}`,
            type: "success",
            confirmButtonClass: "md-button md-success btn-fill",
            buttonsStyling: false
          });
        }
      });
    },
    deleteResult(item) {
      // let indexToDelete = this.resultData.findIndex(
      //   tableRow => tableRow.id === item.id
      // );
      // if (indexToDelete >= 0) {
      //   this.resultData.splice(indexToDelete, 1);
      // }

      let indexToDelete = this.resultData.findIndex(
        tableRow => tableRow.id === item.id
      );

      if (indexToDelete >= 0) {
        this.payload = this.resultData[indexToDelete];
        this.payload.initiativeId = this.record.id;

        this.removeInitiativeResult(this.payload);
      }
      this.$emit("on-save");
    }
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.resultData, {
      keys: ["quarter", "accumulatedActual"],
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
      let result = this.resultData;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    }
  }
};
</script>
<style></style>
