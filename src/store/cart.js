import initiatives from "./initiatives";

export default {
    namespaced: true,
    state: {
        lines: []
    },
    getters: {
        // itemCount: state => state.lines.reduce((total, line) =>
        //     total + line.quantity, 0),
        // totalPrice: state => state.lines.reduce((total, line) =>
        // total + (line.quantity * line.product.price), 0)
    },
    mutations: {
        addInitiative(state, initiative) {
            let line = state.lines.findIndex(line => line.id == initiative.id);

            if (line > -1) {
                let item = state.lines[line];
                item.year = initiative.year;
                item.strategy = initiative.strategy;
                item.sector = initiative.sector;
                item.status = initiative.status;
                item.name = initiative.name;

            } else {
                state.lines.push({
                    id: initiative.id,
                    year: initiative.year,
                    strategy: initiative.strategy,
                    sector: initiative.sector,
                    status: initiative.status,
                    name: initiative.name,
                    target: [],
                    result: []
                });
            }
        },
        addInitiativeTarget(state, target) {
            let initiativeIndex = state.lines.findIndex(line => line.id == target.initiativeId);
            let targetId = state.lines[initiativeIndex].target.findIndex(line => line.id == target.id);

            if (targetId == -1) {
                state.lines[initiativeIndex].target.push({
                    id: target.id,
                    quarterYear: target.quarterYear,
                    quarter: target.quarter,
                    year: target.year,
                    from: target.from,
                    to: target.to,
                    target: target.target
                });
            } else {
                let indexToUpdate = state.lines[initiativeIndex].target.findIndex(
                    tableRow => tableRow.id === target.id
                );

                if (indexToUpdate >= 0) {
                    state.lines[initiativeIndex].target.splice(indexToUpdate, 1);
                }

                state.lines[initiativeIndex].target.push({
                    id: target.id,
                    quarterYear: target.quarterYear,
                    quarter: target.quarter,
                    year: target.year,
                    from: target.from,
                    to: target.to,
                    target: target.target
                });
            }
        },
        removeInitiativeTarget(state, target) {
            let initiativeIndex = state.lines.findIndex(line => line.id == target.initiativeId);
            let indexToDelete = state.lines[initiativeIndex].target.findIndex(line => line.id == target.id);

            if (indexToDelete >= 0) {
                state.lines[initiativeIndex].target.splice(indexToDelete, 1);
            }
        },
        addInitiativeResult(state, result) {
            let initiativeIndex = state.lines.findIndex(line => line.id == result.initiativeId);
            let resultId = state.lines[initiativeIndex].result.findIndex(line => line.id == result.id);

            if (resultId == -1) {
                state.lines[initiativeIndex].result.push({
                    id: result.id,
                    from: result.from,
                    to: result.to,
                    accumulatedActual: result.accumulatedActual,
                    status: result.status
                });
            } else {
                let indexToUpdate = state.lines[initiativeIndex].result.findIndex(
                    tableRow => tableRow.id === result.id
                );

                if (indexToUpdate >= 0) {
                    state.lines[initiativeIndex].result.splice(indexToUpdate, 1);
                }

                state.lines[initiativeIndex].result.push({
                    id: result.id,
                    from: result.from,
                    to: result.to,
                    accumulatedActual: result.accumulatedActual,
                    status: result.status
                });
            }
        },
        removeInitiativeResult(state, result) {
            let initiativeIndex = state.lines.findIndex(line => line.id == result.initiativeId);
            let indexToDelete = state.lines[initiativeIndex].result.findIndex(line => line.id == result.id);

            if (indexToDelete >= 0) {
                state.lines[initiativeIndex].result.splice(indexToDelete, 1);
            }
        },
        removeInitiative(state, lineToRemove) {
            let index = state.lines.findIndex(line => line == lineToRemove);
            if (index > -1) {
                state.lines.splice(index, 1);
            }
        },
        setInitiativeData(state, data) {
            state.lines = data;
        }
    },
    actions: {
        loadInitiativeData(context) {
            let data = localStorage.getItem("initiative");

            if (data != null) {
                context.commit("setInitiativeData", JSON.parse(data));
            }

        },
        storeInitiativeData(context) {
            localStorage.setItem("initiative", JSON.stringify(context.state.lines));
        },
        clearInitiativeData(context) {
            context.commit("setInitiativeData", []);
        },
        initializeInitiative(context, store) {
            context.dispatch("loadInitiativeData");
            store.watch(state => state.lines, () => context.dispatch("storeInitiativeData"), { deep: true });
        }
    }
}