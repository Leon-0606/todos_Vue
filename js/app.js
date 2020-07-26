const app = new Vue({
  el: '.todoapp',
  data: {
    list: [],
    iptValue: '',
    currentId: '',
    btnIdx: 0,
    filters: ['All', 'Active', 'Completed'],
  },
  async created() {
    try {
      const res = await axios.get('http://localhost:8080/search')
      this.list = res.data.data
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    total() {
      return this.list.filter((item) => !item.flag).length
    },
    isShow() {
      return this.list.some((item) => item.flag)
    },
    all: {
      get() {
        return this.list.every((item) => item.flag)
      },
      set(value) {
        this.list.forEach((item) => {
          item.flag = value
          app.changeState(item)
        })
      },
    },
    changeList() {
      let arr = this.list.slice()
      if (this.btnIdx === 0) {
        return arr
      } else if (this.btnIdx === 1) {
        return arr.filter((item) => !item.flag)
      } else {
        return arr.filter((item) => item.flag)
      }
    },
  },
  methods: {
    async changeState(item) {
      try {
        const res = await axios.post(
          'http://localhost:8080/edit',
          JSON.stringify({
            id: item.id,
            name: item.name,
            flag: item.flag,
          })
        )
        this.list = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    async del(id) {
      try {
        const res = await axios.post('http://localhost:8080/del', JSON.stringify({ id }))
        this.list = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    async add() {
      try {
        const res = await axios.post(
          'http://localhost:8080/add',
          JSON.stringify({
            name: this.iptValue,
          })
        )
        this.list = res.data.data
        this.iptValue = ''
      } catch (err) {
        console.log(err)
      }
    },
    dblclick(id) {
      this.currentId = id
    },
    async finish(item) {
      let { id, name, flag } = item
      try {
        const res = await axios.post(
          'http://localhost:8080/edit',
          JSON.stringify({ id, name, flag })
        )
        this.list = res.data.data
        this.currentId = ''
      } catch (err) {
        console.log(err)
      }
    },
    remove() {
      this.list.forEach((item) => {
        if (item.flag) {
          this.del(item.id)
        }
      })
    },
    click(idx) {
      this.btnIdx = idx
    },
  },
})
