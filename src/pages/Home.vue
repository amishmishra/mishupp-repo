<template>
    <div>
        <h4 class="display-1">Welcome, {{ currentUser }}</h4>

        <p class="body-1">This is our award-winning home page.</p>
    </div>
</template>
<script>

export default {
    name: "HomePage",
    methods: {
        redirect: function() {
            if(!this.$root.currentUser) this.$router.push({name: "login"});
        }
    },
    beforeMount(){
        this.redirect();
    },
    computed: {
        currentUser: function() {
            if (this.$root.currentUser) {
                return this.$root.currentUser;
            } else {
                return "no one logged in";
            }
        }
   }
}
</script>