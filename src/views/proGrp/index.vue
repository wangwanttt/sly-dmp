<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="addPrj()"
      >新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="prjList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="项目名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="'项目编辑'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="prjVo" label-position="left">
        <el-form-item label="项目名称" prop="name" :maxlength="20">
          <el-input
            v-model="prjVo.name"
            oninput="if(prjVo.name.length>20 ) prjVo.name=prjVo.name.slice(0,20)"
          />
        </el-form-item>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?submitForm():updateData()">保存</el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?submitForm():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let that;
/* eslint-disable */

import { getGrpList, savePrjGrp, delPrjGrp, updatePrjGrp } from "@/api/project";
import valid, { checkTel } from "../../api/valid";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "create",
      prjList: [],
      prjVo: {
        payType: 1,
        payWay: 11
      },
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "change" },
          {
            min: 4,
            max: 20,
            message: "长度在 4到 20 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },

  beforeCreate() {
    that = this;
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getGrpList().then(response => {
        this.prjList = response.data;
        this.listLoading = false;
      });
    },

    addPrj() {
      //  this.resetprjVo()
      this.dialogStatus = "create";
      this.prjVo = { payType: 10, payWay: 10 };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    submitForm() {
      this.listLoading = true;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          savePrjGrp(this.prjVo)
            .then(response => {
              layer.alert(response.data.msg);
              if (response.data.code < 1) {
                return;
              }

              this.fetchData();
            this.dialogFormVisible = false;
              this.listLoading = false;
            })
            .catch(error => {
              layer.alert(error);
            });
        }
      });
    },

    handleUpdate(row) {
      this.prjVo = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const prjVoData = Object.assign({}, this.prjVo);
          updatePrjGrp(prjVoData).then(response => {
            layer.alert(response.data.msg);
            debugger;
            if (response.data.code < 1) {
              return;
            }
            this.fetchData();
            this.dialogFormVisible = false;
          });
        }
      });
    },
    handleDelete(row, index) {
      layer.confirm(
        "是否确定删除此项目【如已有项目已使用此项，将会造成无法支付】",
        { btn: ["确定", "取消"], title: "提示" },
        () => {
          delPrjGrp(row.id)
            .then(result => {
              layer.alert("删除成功");
              this.fetchData();
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

<style lang="scss" scoped>
.el-form .el-select {
  width: 100%;
}
.el-form .el-input {
  width: 100%;
}
</style>

