<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-66 md-xsmall-size-80 mx-auto">
      <simple-wizard>
        <template slot="header">
          <h3 class="title">{{ initiative || "Initiative" }}</h3>
        </template>

        <wizard-tab :before-change="() => validateStep('step1')">
          <template slot="label">General Information</template>
          <first-step
            ref="step1"
            @on-save="onFirstStepSaved"
            @on-validated="onStepValidated"
            :initiative="initiative"
            :record="formData"
            @interface="getInitiativeName"
          ></first-step>
        </wizard-tab>

        <wizard-tab :before-change="() => validateStep('step2')">
          <template slot="label">Target</template>
          <second-step ref="step2" :record="formData" @on-save="onSecondStepSaved" @on-validated="onStepValidated"></second-step>
        </wizard-tab>

        <wizard-tab :before-change="() => validateStep('step3')">
          <template slot="label">Result</template>
          <third-step ref="step3" :record="formData" @on-save="onThirdStepSaved" @on-validated="wizardComplete"></third-step>
        </wizard-tab>
      </simple-wizard>
    </div>
  </div>
</template>
<script>
import FirstStep from "./Wizard/FirstStep.vue";
import SecondStep from "./Wizard/SecondStep.vue";
import ThirdStep from "./Wizard/ThirdStep.vue";
import swal from "sweetalert2";
import { SimpleWizard, WizardTab } from "@/components";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      wizardModel: {},
      initiative: "",
      formData: {},
      id: 0
    };
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id != null) {
      this.formData = this.tableData.find(line => line.id == this.id);
      this.initiative = this.formData.name;
    } else {
      this.formData = {};
      this.initiative = "";
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.store.lines
    })
  },
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    SimpleWizard,
    WizardTab
  },
  methods: {
    getInitiativeName(event) {
      this.initiative = event;
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onFirstStepSaved(data) {
      if (this.id == null || this.id == 0) {
        this.id = this.tableData.length + 1;
      }

      if (data != null) {
        data.id = this.id;
        this.addInitiative(data);
        this.formData = data;
        this.storeInitiativeData();
        console.log(this.id);
      }
    },
    onSecondStepSaved() {
      this.storeInitiativeData();
    },
    onThirdStepSaved() {
      this.storeInitiativeData();
      // if (data != null) {
      //   data.itemId = this.id;
      //   this.addInitiativeResult(data);
      //   // this.formData.result = data;
      //   // this.addInitiative(this.formData);
      // }
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    wizardComplete() {
      //this.storeInitiativeData();
      swal.fire({
        title: "Success!",
        text: "Your initiative is successfully submitted",
        type: "success",
        confirmButtonClass: "md-button md-success",
        buttonsStyling: false
      });
      this.$router.push("/table-list/paginated");
    },
    ...mapMutations({
      addInitiative: "store/addInitiative",
      //addInitiativeTarget: "store/addInitiativeTarget",
      //addInitiativeResult: "store/addInitiativeResult"
    }),
    ...mapActions({
      storeInitiativeData: "store/storeInitiativeData"
    })
  }
};
</script>
