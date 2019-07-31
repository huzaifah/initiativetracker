<template>
  <div>
    <h5 class="info-text">Fill in some basic information about this initiative</h5>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-field
          :class="[
            { 'md-valid': !errors.has('year') && touched.year },
            { 'md-error': errors.has('year') }
          ]"
        >
          <label for="year">Year</label>
          <md-select
            v-model="year"
            name="year"
            id="year"
            data-vv-name="year"
            required
            v-validate="modelValidations.year"
          >
            <md-option value="2018">2018</md-option>
            <md-option value="2019">2019</md-option>
            <md-option value="2020">2020</md-option>
          </md-select>
        </md-field>

        <md-field
          :class="[
            { 'md-valid': !errors.has('strategy') && touched.strategy },
            { 'md-error': errors.has('strategy') }
          ]"
        >
          <label for="strategy">Strategy</label>
          <md-select
            v-model="strategy"
            name="strategy"
            id="strategy"
            data-vv-name="strategy"
            required
            v-validate="modelValidations.strategy"
          >
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
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-field
          :class="[
            { 'md-valid': !errors.has('sector') && touched.sector },
            { 'md-error': errors.has('sector') }
          ]"
        >
          <label for="sector">Sector</label>
          <md-select
            v-model="sector"
            name="sector"
            id="sector"
            data-vv-name="sector"
            required
            v-validate="modelValidations.sector"
          >
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
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-field
          :class="[
            { 'md-valid': !errors.has('name') && touched.name },
            { 'md-error': errors.has('name') }
          ]"
        >
          <label for="name">Initiative</label>
          <md-input
            v-model="name"
            @change="handleData"
            type="text"
            data-vv-name="name"
            required
            v-validate="modelValidations.name"
          ></md-input>
        </md-field>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-field
          :class="[
            { 'md-valid': !errors.has('status') && touched.sector },
            { 'md-error': errors.has('status') }
          ]"
        >
          <label for="sector">Status</label>
          <md-select
            v-model="status"
            name="status"
            id="status"
            data-vv-name="status"
            required
            v-validate="modelValidations.status"
          >
            <md-option value="Not Started">Not Started</md-option>
            <md-option value="Completed">Completed</md-option>
            <md-option value="Deferred">Deferred</md-option>
          </md-select>
        </md-field>
      </div>
    </div>
  </div>
</template>
<script>
import { SlideYDownTransition } from "vue2-transitions";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    SlideYDownTransition
  },
  computed: {},
  props: {
    initiative: {
      type: String,
      default() {
        return "";
      }
    },
    record: {
      default: null
    }
  },
  created() {
    if (this.record != null) {
      this.strategy = this.record.strategy;
      this.sector = this.record.sector;
      this.name = this.record.name;
      this.status = this.record.status;
      this.year = this.record.year;
    }
  },
  data() {
    return {
      strategy: "",
      sector: "",
      name: "",
      status: "",
      year: "",
      touched: {
        strategy: false,
        sector: false,
        name: false,
        status: false,
        year: false
      },
      modelValidations: {
        strategy: {
          required: true
        },
        sector: {
          required: true
        },
        name: {
          required: true
        },
        status: {
          required: true
        },
        year: {
          required: true
        }
      }
    };
  },
  methods: {
    handleData: function() {
      this.$emit("interface", this.name);
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then(res => {
        this.$emit("on-validated", res);
        this.$emit("on-save", {
          name: this.name,
          strategy: this.strategy,
          status: this.status,
          sector: this.sector,
          year: this.year
        });
        return res;
      });
    }
  },
  watch: {
    strategy() {
      this.touched.strategy = true;
    },
    sector() {
      this.touched.sector = true;
    },
    name() {
      this.touched.name = true;
    },
    status() {
      this.touched.status = true;
    },
    year() {
      this.touched.year = true;
    }
  },
  beforeMount() {
    this.name = this.initiative;
  }
};
</script>
<style></style>
