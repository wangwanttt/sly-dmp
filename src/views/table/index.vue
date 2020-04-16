<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="id"  >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="项目名称"   align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.prjId |prjNameFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号"  align="center">
        <template slot-scope="scope">{{ scope.row.tradeNo }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="支付时间" >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.gmtPayment }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:90%;margin-top:30px;margin-left:30px">
      <!-- 分页 -->
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10,15,20]"
        :page-size="pagelimit"
        layout="total,prev,pager,next,jumper,sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
let that;
/* eslint-disable */
import { getOrderList, getGrpList } from "@/api/project";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    prjNameFilter: value => {
      let payObj = that.prjGrpList.filter(payObj => {
        return payObj.id == value;
      });
      if (payObj.length > 0) return payObj[0].name;
      else return value;
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      isLoading: true, // 默认加载
      pageList: [], // 当前页数据
      total: 0, // 总数据条数
      currentPage: 1, // 当前页
      pagelimit: 10, // 页面展示数据条数
      list: [], // 原始数据
      search: [], // 搜索字段
      tmpList: [], // 临时搜索结果数据
      prjGrpList: []
    };
  },
  created() {
      that = this;
    this.getPrjGrpData();
  },
  methods: {
    getPrjGrpData() {
      this.listLoading = true;
      getGrpList().then(response => {
        this.prjGrpList = response.data;
         this.listLoading = false;
        this.initPageList();
      });
    },
    initPageList() {
      this.listLoading = true;
      getOrderList({ page: this.currentPage - 1, size: this.pagelimit }).then(
        response => {
          
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          this.listLoading = false;
        }
      );
    },
    // 改变页面条数
    handleSizeChange: function(size) {
      this.pagelimit = size;
      this.initPageList();
    },

    // 改变当前页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      
      this.initPageList();
    }
  }
};
</script>
