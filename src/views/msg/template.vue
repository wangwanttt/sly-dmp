<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select placeholder="请选择" v-model="tplVo.prjId" @change="prjChange()">
        <el-option
          class="cateClass"
          v-for="(item,index) in prjGrpList"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="addTpl()"
      >新增</el-button>
    </div>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column prop="id" width="210" header-align="center" align="center" label="ID" />
      <el-table-column prop="title" header-align="center" width="200" label="模板标题" />
      <el-table-column prop="content" header-align="center" label="模板内容" />
      <el-table-column prop="type" header-align="center" align="center" width="80" label="模板类型">
        <template slot-scope="{row}">
          <el-tag v-if="row.type=='1'" size="small">消息</el-tag>
          <el-tag v-else size="small" type="danger">通知</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="remark" header-align="center"  label="备注 " /> -->
      <el-table-column prop="flag" header-align="center" label="处理标志" />
      <el-table-column prop="remark" header-align="center" label="备注说明" />

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120"
        label="创建时间"
      >
        <template slot-scope="scope">{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</template>
      </el-table-column>

      <el-table-column fixed="right" width="120" header-align="center" align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="addTpl(row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(row)" :v-auth="['temp:del',1]">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper" 
    />-->

    <temp-add-update v-if="addOrUpdate" ref="add-or-update" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import TempAddUpdate from "./template-add-update";
let that;
import { getGrpList, list, save, del, update } from "@/api/tplMgr";

export default {
  name: "template",
  components: { TempAddUpdate },
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      prjGrpList: {},
      dataForm: {
        title: ""
      },
      addOrUpdate: false,
      tplVo: {}
    };
  },
  created() {
    this.getPrjList();
  },
  filters: {
    filterUse(use) {
      switch (use) {
        case 10:
          return "商品发货";
        default:
          return "其他";
      }
    }
  },
  methods: {
    /**得到项目列表 */
    getPrjList() {
      this.listLoading = true;
      getGrpList().then(response => {
        this.prjGrpList = response.data;

        this.listLoading = false;
        this.tplVo.prjId = this.prjGrpList[0].id;
        this.getDataList();
      });
    },
    /** 项目框变动时 */
    prjChange() {
      this.getDataList();
    },
    /** 新增一个消息模板 */
    addTpl(data) {
      this.addOrUpdate = true;
      this.$nextTick(() => {
        //  this.tplVo={prjId:this.tpj};
        //  this.tplVo={};
        if (data) {
          this.$refs["add-or-update"].init(data, this.prjGrpList);
        } else {
          this.$refs["add-or-update"].init(
            Object.assign({}, this.tplVo),
            this.prjGrpList
          );
        }
      });
    },

    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.listLoading = true;
      list(this.tplVo.prjId).then(response => {
        this.dataList = response.data.data;
        this.dataListLoading = false;
      });
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },

    // 删除
    handleDelete(row, index) {
      layer.confirm(
        "是否确定删除此模板",
        { btn: ["确定", "取消"], title: "提示" },
        () => {
          del(row.id)
            .then(result => {
              layer.alert("删除成功");
              this.getDataList();
            })
            .catch(error => {
              layer.closeAll();
            });
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
