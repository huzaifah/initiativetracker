<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">Initiatives</h4>
        </md-card-header>
        <md-card-content>
          <md-field>
            <label for="name">Initiative</label>
            <md-input v-model="searchName" name="name" id="name" type="text"></md-input>
          </md-field>

          <md-field>
            <label for="strategy">Strategy</label>
            <md-select v-model="searchStrategy" name="strategy" id="strategy">
              <md-option value>ALL</md-option>
              <md-option value="Campaign and Collaborations">Campaign and Collaborations</md-option>
              <md-option
                value="Collaborate with Cash Management on CIB Customers"
              >Collaborate with Cash Management on CIB Customers</md-option>
              <md-option value="Focus on Middle and Upper Income">Focus on Middle and Upper Income</md-option>
              <md-option
                value="Focus on Manufacturing and Services"
              >Focus on Manufacturing and Services</md-option>
              <md-option
                value="Increase Gross Financing Balance for Business Banking"
              >Increase Gross Financing Balance for Business Banking</md-option>
              <md-option
                value="New Product Offering and Process Improvement"
              >New Product Offering and Process Improvement</md-option>
              <md-option value="Support Fee Based Income">Support Fee Based Income</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="sector">Sector</label>
            <md-select v-model="searchSector" name="sector" id="sector">
              <md-option value>ALL</md-option>
              <md-option value="Channel">Channel</md-option>
              <md-option value="Credit Card">Credit Card</md-option>
              <md-option value="Funding">Funding</md-option>
              <md-option value="Hire Purchase">Hire Purchase</md-option>
              <md-option value="Mortgage">Mortgage</md-option>
              <md-option value="Pawn Broking">Pawn Broking</md-option>
              <md-option value="Personal Finance">Personal Finance</md-option>
              <md-option value="SME">SME</md-option>
              <md-option value="Wealth Management">Wealth Management</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="sector">Status</label>
            <md-select v-model="searchStatus" name="status" id="status">
              <md-option value>ALL</md-option>
              <md-option value="Not Started">Not Started</md-option>
              <md-option value="Completed">Completed</md-option>
              <md-option value="Deferred">Deferred</md-option>
            </md-select>
          </md-field>

          <md-field>
            <label for="year">Year</label>
            <md-select v-model="searchYear" name="year" id="year">
              <md-option value>ALL</md-option>
              <md-option value="2018">2018</md-option>
              <md-option value="2019">2019</md-option>
              <md-option value="2020">2020</md-option>
            </md-select>
          </md-field>
          <md-button class="md-success" @click="search()">Search</md-button>&nbsp;
          <md-button class="md-success" @click="displayAddNew()">Add New</md-button>
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

              <!-- <md-field>
                <md-input
                  type="search"
                  class="mb-3"
                  clearable
                  style="width: 200px"
                  placeholder="Search records"
                  v-model="searchQuery"
                ></md-input>
              </md-field> -->
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

              <md-table-cell md-label="Year">{{ item.year }}</md-table-cell>
              <md-table-cell md-label="Strategy">{{ item.strategy }}</md-table-cell>
              <md-table-cell md-label="Sector/Programme">{{ item.sector }}</md-table-cell>
              <md-table-cell md-label="Initiative">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Status">{{ item.status }}</md-table-cell>

              <md-table-cell md-label="Actions">
                <!-- <md-button class="md-just-icon md-info md-simple" @click.native="handleLike(item)">
                  <md-icon>favorite</md-icon>
                </md-button>-->
                <md-button
                  class="md-just-icon md-warning md-simple"
                  @click.native="handleEdit(item)"
                >
                  <md-icon>dvr</md-icon>
                </md-button>&nbsp;
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
          </div>-->
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
    </div>
  </div>
</template>

<script>
import { Pagination } from "@/components";
// import users from "./users";
//import initiatives from "./initiatives";
import Fuse from "fuse.js";
import Swal from "sweetalert2";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Pagination
  },
  computed: {
    ...mapState({
      tableData: state => state.store.lines
    }),
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
      footerTable: [
        "Year",
        "Strategy",
        "Sector/Programme",
        "Initiative",
        "Status",
        "Actions"
      ],
      searchQuery: "",
      searchStrategy: "",
      searchStatus: "",
      searchSector: "",
      searchYear: "",
      searchName: "",
      propsToSearch: ["year", "strategy", "sector", "name"],
      searchedData: [],
      fuseSearch: null
    };
  },
  methods: {
    ...mapMutations({
      removeInitiative: "store/removeInitiative"
    }),
    ...mapActions({
      loadInitiativeData: "store/loadInitiativeData",
      storeInitiativeData: "store/storeInitiativeData"
    }),
    search() {
      let result = this.tableData;
      
      if (this.searchStrategy != "") {
        result = this.searchDetail(result, this.searchStrategy);
      }

      if (this.searchYear != "") {
        result = this.searchDetail(result, this.searchYear);
      }

      if (this.searchStatus != "") {
        result = this.searchDetail(result, this.searchStatus);
      }

      if (this.searchSector != "") {
        result = this.searchDetail(result, this.searchSector);
      }

      if (this.searchName != "") {
        result = this.searchDetail(result, this.searchName);
      }

      this.searchedData = result;
    },
    searchDetail(data, searchValue) {
      let gridSearch = new Fuse(data, {
        keys: ["year", "strategy", "sector", "name", "status"],
        threshold: 0.0
      });

      return gridSearch.search(searchValue);
    },
    displayAddNew() {
      this.$router.push("/forms/wizard");
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
      this.$router.push(`/forms/wizard/${item.id}`);
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
          this.removeInitiative(item);
          //this.storeInitiativeData();
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
    }
  },
  mounted() {
    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["year", "strategy", "sector", "name", "status"],
      threshold: 0.0
    });

    this.loadInitiativeData();
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

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
