<template>
    <div id="app">
        <h4 class="bg-primary text-white text-center p-2">
            {{name}}'s To Do List
        </h4>
        <div class="container-fluid p-4">
            <div class="row" v-if="filteredTasks.length == 0">
                <div class="col text-center">
                    <b>Nothing to do. Hurrah!</b></div>
            </div>
            <template v-else>
                <div class="row m-1">
                    <div class="col-sm font-weight-bold">Task</div>
                    <div class="col-sm-1 font-weight-bold text-center"></div>
                    <div class="col-sm-1 font-weight-bold text-center">Done</div>
                    <div class="col-sm-1"></div>
                </div>
                <div class="row m-1" v-for="t in filteredTasks" v-bind:key="t.id">
                    <p class="col" contenteditable="true" @focusout="modifyTask($event, t.id, t.action)"> {{t.action}}</p>
                    <div class="col-sm-1 text-center">
                        <input type="checkbox" v-model="t.done" class="form-check-input" v-on:click="modifyDone(t.id)"/>
                    </div>
                    <div class="col-sm-1 text-center">
                        <button class="btn-primary" v-on:click="deleteTask(t.id)">Delete</button>
                    </div>
                </div>
            </template>

            <ValidationObserver tag="div" v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit">
                    <div class="row py-2">
                        <div class="col-sm">
                            <ValidationProvider :rules="{required: true}" v-slot="{errors, failed}">
                                <input v-model="newItemText" class="form-control" :class="{ 'is-invalid': failed}"
                                       v-on:keyup.enter="addTask"/>
                                <div class="invalid-feedback">{{errors[0]}}</div>
                            </ValidationProvider>
                        </div>
                        <div class="col-sm-1 text-center">
                            <button class="btn btn-primary" v-on:click="addTask">Add</button>
                        </div>
                    </div>
                </form>
            </ValidationObserver>

            <div class="row bg-secondary py-2 mt-2 text-white">
                <div class="col text-center">
                    <input type="checkbox" v-model="hideCompleted" class="form-check-input"/> <label
                        class="form-check-label font-weight-bold">
                    Hide completed tasks
                </label>
                </div>
                <div class="col-sm-2 text-right">
                    <button class="btn btn-sm btn-warning" v-on:click="deleteCompleted"> Delete Completed</button>
                </div>
                <div class="col-sm-1 text-right">
                    <button class="btn btn-sm btn-danger" v-on:click="initializeTask">initializeTask</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {ValidationProvider, ValidationObserver, extend} from "vee-validate";
    import {required} from "vee-validate/dist/rules";

    extend("required", {
        ...required,
        message: "This field is required"
    });

    export default {
        name: 'app',
        components: {ValidationProvider, ValidationObserver},
        data() {
            return {
                name: "Lucas",
                tasks: [
                    {id: 1, action: "Study Frontend", done: false},
                    {id: 2, action: "Study Backend", done: false},
                    {id: 3, action: "Study DevOps", done: false},
                    {id: 4, action: "Study Machine Learning", done: true}
                ],
                hideCompleted: true,
                newItemText: ""
            }
        },
        computed: {
            filteredTasks() {
                return this.hideCompleted ? this.tasks.filter(t => !t.done) : this.tasks
            }
        },
        methods: {
            initializeTask() {
                localStorage.clear();
                this.tasks = [
                    {id: this.createId(), action: "Study Frontend", done: false},
                    {id: this.createId(), action: "Study Backend", done: false},
                    {id: this.createId(), action: "Study DevOps", done: false},
                    {id: this.createId(), action: "Study Machine Learning", done: true}
                ];
                this.storeData();
            },
            createId() {
                return new Date().getTime() + Math.random();
            },
            addTask() {
                if (this.newItemText !== "") {
                    this.tasks.push({
                        id: this.createId(), action: this.newItemText, done: false
                    });
                    this.storeData();
                    this.newItemText = "";
                }
            },
            storeData() {
                localStorage.setItem("todos", JSON.stringify(this.tasks));
            },
            modifyTask(e, id, action) {
                console.log("modified task id: " + id);
                console.log("\tmodified task: " + e.target.innerText);
                if (e.target.innerText === "") {
                    e.target.focus();
                    alert("Does not allow empty string");
                    e.target.innerText = action;
                } else {
                    let newTasks = [];
                    for (let [index, task] of this.tasks.entries()) {
                        console.log("[" + index + "]: " + task);
                        if (task.id === id) {
                            task.action = e.target.innerText;
                            newTasks.push(task);
                        } else {
                            newTasks.push(task);
                        }
                    }
                    console.log(newTasks);
                    this.tasks = newTasks;
                    this.storeData();
                }
            },
            modifyDone(id) {
                let newTasks = [];
                for(let [index, task] of this.tasks.entries()) {
                    console.log("[" + index + "]: " + task);
                    if (task.id === id) {
                        task.done = !task.done;
                        newTasks.push(task);
                    } else {
                        newTasks.push(task);
                    }
                }
                this.tasks = newTasks;
                this.storeData();
            },
            deleteTask(id) {
                console.log("deleted task id: " + id);
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.storeData();
            },
            deleteCompleted() {
                this.tasks = this.tasks.filter(t => !t.done);
                this.storeData();
            }
        },
        created() {
            let data = localStorage.getItem("todos");
            if (data != null) {
                this.tasks = JSON.parse(data);
            }
        }
    }
</script>