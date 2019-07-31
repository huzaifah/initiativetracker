<template>
  <form>
    <div class="md-layout">
      <div class="md-layout-item md-size-66 mx-auto md-medium-size-100">
        
        <tabs
          :tab-name="['General Info', 'Target', 'Result']"
          :tab-icon="['info', 'location_on', 'gavel']"
          class="page-subcategories"
          nav-pills-icons
          plain
          color-button="warning"
        >
          <!-- here you can add your content for tab-content -->
          <template slot="tab-pane-1">
            <md-card>
              <md-card-content>
                <div class="md-layout">
                  <div class="md-layout-item">
                    <md-field>
                      <label for="strategy">Strategy</label>
                      <md-select v-model="strategy" name="strategy" id="strategy">
                        <md-option value="fight-club">Campaign and Collaborations</md-option>
                        <md-option
                          value="fight-club"
                        >Collaborate with Cash Management on CIB Customers</md-option>
                        <md-option value="fight-club">Focus on Middle and Upper Income</md-option>
                        <md-option value="fight-club">Focus on Manufacturing and Services</md-option>
                        <md-option
                          value="fight-club"
                        >Increase Gross Financing Balance for Business Banking</md-option>
                        <md-option value="fight-club">New Product Offering and Process Improvement</md-option>
                        <md-option value="fight-club">Support Fee Based Income</md-option>
                      </md-select>
                    </md-field>
                  </div>
                </div>
                <div class="md-layout">
                  <div class="md-layout-item">
                    <md-field>
                      <label for="sector">Sector</label>
                      <md-select v-model="sector" name="sector" id="sector">
                        <md-option value="fight-club">Channel</md-option>
                        <md-option value="fight-club">Credit Card</md-option>
                        <md-option value="fight-club">Funding</md-option>
                        <md-option value="fight-club">Hire Purchase</md-option>
                        <md-option value="fight-club">Mortgage</md-option>
                        <md-option value="fight-club">Pawn Broking</md-option>
                        <md-option value="fight-club">Personal Finance</md-option>
                        <md-option value="fight-club">SME</md-option>
                        <md-option value="fight-club">Wealth Management</md-option>
                      </md-select>
                    </md-field>
                  </div>
                </div>
                <div class="md-layout">
                  <div class="md-layout-item">
                    <md-field>
                      <label for="name">Initiative</label>
                      <md-input v-model="name" type="text"></md-input>
                    </md-field>
                  </div>
                </div>
                <div class="md-layout">
                  <div class="md-layout-item">
                    <md-field>
                      <label for="sector">Status</label>
                      <md-select v-model="status" name="status" id="status">
                        <md-option value="fight-club">Not Started</md-option>
                        <md-option value="fight-club">Completed</md-option>
                        <md-option value="fight-club">Deferred</md-option>
                      </md-select>
                    </md-field>
                  </div>
                </div>
              </md-card-content>
            </md-card>
          </template>
          <template slot="tab-pane-2">
            <md-card>
              <!-- <md-card-header class="md-card-header-icon md-card-header-green">
                <div class="card-icon">
                  <md-icon>assignment</md-icon>
                </div>
                <h4 class="title">Initiatives</h4>
              </md-card-header>-->
              <md-card-content>
                <md-button class="md-success">Add New</md-button>
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
                    <!-- <md-table-cell md-label="Name" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Email" md-sort-by="email">{{
                item.email
              }}</md-table-cell>
              <md-table-cell md-label="Age">{{ item.age }}</md-table-cell>
              <md-table-cell md-label="Salary">{{ item.salary }}</md-table-cell>
                    -->

                    <md-table-cell md-label="Quarter">{{ item.quarter }}</md-table-cell>
                    <md-table-cell md-label="From">{{ item.from }}</md-table-cell>
                    <md-table-cell md-label="To">{{ item.to }}</md-table-cell>
                    <md-table-cell md-label="Target">{{ item.target }}</md-table-cell>

                    <md-table-cell md-label="Actions">
                      
                      <md-button
                        class="md-just-icon md-warning md-simple"
                        @click.native="handleEdit(item)"
                      >
                        <md-icon>dvr</md-icon>
                      </md-button>
                      <md-button
                        class="md-just-icon md-danger md-simple"
                        @click.native="handleDelete(item)"
                      >
                        <md-icon>close</md-icon>
                      </md-button>
                    </md-table-cell>
                  </md-table-row>
                </md-table>
                <!-- <div class="footer-table md-table">
                  <table>
                    <tfoot>
                      <tr>
                        <th v-for="item in footerTable" :key="item.name" class="md-table-head">
                          <div class="md-table-head-container md-ripple md-disabled">
                            <div class="md-table-head-label">{{ item }}</div>
                          </div>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div> -->
              </md-card-content>
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
            </md-card>
          </template>
          <template slot="tab-pane-3">
            <md-card>
              <md-card-content>
                <md-button class="md-success">Add New</md-button>
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
                    <!-- <md-table-cell md-label="Name" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="Email" md-sort-by="email">{{
                item.email
              }}</md-table-cell>
              <md-table-cell md-label="Age">{{ item.age }}</md-table-cell>
              <md-table-cell md-label="Salary">{{ item.salary }}</md-table-cell>
                    -->

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
                <!-- <div class="footer-table md-table">
                  <table>
                    <tfoot>
                      <tr>
                        <th v-for="item in footerTable" :key="item.name" class="md-table-head">
                          <div class="md-table-head-container md-ripple md-disabled">
                            <div class="md-table-head-label">{{ item }}</div>
                          </div>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div> -->
              </md-card-content>
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
            </md-card>
          </template>
        </tabs>
      </div>
    </div>
  </form>
</template>
<script>
import { SlideYDownTransition } from "vue2-transitions";
import { Tabs } from "@/components";
import { Collapse } from "@/components";
import { Pagination } from "@/components";
// import users from "./users";
//import initiatives from "./initiatives";
import targets from "./targets";
import results from "./results";
import Fuse from "fuse.js";
import Swal from "sweetalert2";

export default {
  components: {
    Tabs,
    SlideYDownTransition
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
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
        : this.tableData.length;
    },
    toResult() {
      let highBound = this.fromResult + this.pagination.perPage;
      if (this.totalResult < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    fromResult() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    totalResult() {
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
      footerTable: [
        "Quarter",
        "From",
        "To",
        "Target",
        "Actions"
      ],
      searchQuery: "",
      propsToSearch: ["quarter", "from", "to", "target"],
      tableData: targets,
      resultData: results,
      searchedData: [],
      fuseSearch: null,

      equalToSource: "",
      equalToDest: "",
      required: "",
      email: "",
      number: "",
      url: "",
      touched: {
        required: false,
        email: false,
        number: false,
        url: false,
        equalToSource: false,
        equalToDest: false
      },
      modelValidations: {
        required: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        number: {
          required: true,
          numeric: true
        },
        url: {
          required: true,
          url: true
        },
        equalToSource: {
          required: true
        },
        equalToDest: {
          required: true,
          confirmed: "equalToSource"
        }
      }
    };
  },
  methods: {
    validate() {
      this.$validator.validateAll().then(isValid => {
        this.$emit("on-submit", this.registerForm, isValid);
      });
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
      Swal.fire({
        title: `You want to edit ${item.quarter}`,
        buttonsStyling: false,
        confirmButtonClass: "md-button md-info"
      });
      //this.$router.push("/forms/validation");
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
            text: `You deleted ${item.name}`,
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
        this.tableData.splice(indexToDelete, 1);
      }
    },
    handleEditResult(item) {
      Swal.fire({
        title: `You want to edit ${item.accumulatedActual}`,
        buttonsStyling: false,
        confirmButtonClass: "md-button md-info"
      });
      //this.$router.push("/forms/validation");
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
            text: `You deleted ${item.name}`,
            type: "success",
            confirmButtonClass: "md-button md-success btn-fill",
            buttonsStyling: false
          });
        }
      });
    },
    deleteResult(item) {
      let indexToDelete = this.resultData.findIndex(
        tableRow => tableRow.id === item.id
      );
      if (indexToDelete >= 0) {
        this.resultData.splice(indexToDelete, 1);
      }
    },
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["quarter", "target"],
      threshold: 0.3
    });
  },
  watch: {
    required() {
      this.touched.required = true;
    },
    email() {
      this.touched.email = true;
    },
    number() {
      this.touched.number = true;
    },
    url() {
      this.touched.url = true;
    },
    equalToSource() {
      this.touched.equalToSource = true;
    },
    equalToDest() {
      this.touched.equalToDest = true;
    },
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
<style lang="scss" scoped>
.md-card .md-card-actions {
  border: none;
}

.text-center {
  justify-content: center !important;
}
</style>
