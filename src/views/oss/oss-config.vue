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
      :data="configList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="项目名称" width="120">
        <template slot-scope="scope">{{ scope.row.prjId|prjNameFilter}}</template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="阿里云路径" width="210" align="center">
        <template slot-scope="scope">{{ scope.row.path_prefix }}</template>
      </el-table-column>
      <el-table-column label="阿里云EndPoint" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oss_endpoint }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阿里云AccessKeyId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oss_access_key_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="AccessKeySecret" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oss_access_key_secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阿里云BucketName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oss_bucket_name }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="云存储配置" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form
        :model="ossConfigVo"
        :rules="rules"
        ref="dataForm"
        @submit.native.prevent
        label-width="140px"
      >
        <el-form-item label="项目选择" prop="prjId">
          <el-select placeholder="请选择" v-model="ossConfigVo.prjId" clearable>
            <el-option
              class="cateClass"
              v-for="(item,index) in prjGrpList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域名" prop="path_prefix">
          <el-input
            v-model="ossConfigVo.path_prefix"
            placeholder="阿里云绑定的域名:https://xx-oss.oss-cn-beijing.aliyuncs.com/--最后/不能少"
            maxlength="0"
          ></el-input>
        </el-form-item>

        <el-form-item label="EndPoint" prop="oss_endpoint">
          <el-input v-model="ossConfigVo.oss_endpoint" placeholder="阿里云EndPoint" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="AccessKeyId" prop="oss_access_key_id">
          <el-input
            v-model="ossConfigVo.oss_access_key_id"
            placeholder="阿里云AccessKeyId"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="AccessKeySecret" prop="oss_access_key_secret">
          <el-input
            v-model="ossConfigVo.oss_access_key_secret"
            placeholder="阿里云AccessKeySecret"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="BucketName" prop="oss_bucket_name">
          <el-input
            v-model="ossConfigVo.oss_bucket_name"
            placeholder="阿里云BucketName"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="maxSize" prop="maxSize">
          <el-input
            v-model.number="ossConfigVo.maxSize"
            placeholder="文件最大尺寸（M）0为不限制"
            maxlength="3"
          ></el-input>
        </el-form-item>

        <el-form-item label="callFunc" prop="callFunc">
          <el-input
            v-model.number="ossConfigVo.callFunc"
            placeholder="如果是直传，则填，否则为空"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?submitForm():updateData()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
let that;
import { getGrpList, list, save, del, update } from "@/api/fileMgr";
export default {
  data() {
    return {
      visible: false,
      dataRule: {},
      configList: [],
      prjGrpList: [],
      ossConfigVo: { maxSize: 0 },
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "create",
      rules: {
        path_prefix: [
          { required: true, message: "路径不能为空", trigger: "change" },
          {
            min: 10,
            max: 120,
            message: "长度在 10到 100 个字符",
            trigger: "change"
          }
        ],
        oss_endpoint: [
          { required: true, message: "endPoint不能为空", trigger: "change" },
          {
            min: 10,
            max: 120,
            message: "长度在 10到 100 个字符",
            trigger: "change"
          }
        ],
        oss_bucket_name: [
          { required: true, message: "bucket_name不能为空", trigger: "change" },
          {
            min: 4,
            max: 120,
            message: "长度在 4到 100 个字符",
            trigger: "change"
          }
        ],
        oss_access_key_id: [
          { required: true, message: "bucket_name不能为空", trigger: "change" },
          {
            min: 10,
            max: 120,
            message: "长度在 10到 100 个字符",
            trigger: "change"
          }
        ],
        maxSize: [
          {
            required: true,
            message: "最大上传大小不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  filters: {
    prjNameFilter: value => {
      let payObj = that.prjGrpList.filter(payObj => {
        return payObj.id == value;
      });
      if (payObj.length > 0) return payObj[0].name;
      else return value;
    }
  },
  created() {
    that = this;
    this.getPrjList();
  },
  methods: {
    getPrjList() {
      this.listLoading = true;

      getGrpList().then(response => {
        this.prjGrpList = response.data;
        this.listLoading = false;

        this.fetchData();
      });
    },

    fetchData() {
      this.listLoading = true;

      list()
        .then(response => {
          this.configList = response.data.data;
          this.listLoading = false;
        })
        .catch(error => {
          this.listLoading = false;
        });
    },

    /** 点击新增按钮 */
    addPrj() {
      //  this.resetprjVo()
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    submitForm() {
      this.listLoading = true;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let domain = this.ossConfigVo.path_prefix;
          if (domain.substr(domain.length - 1) != "/") {
            layer.alert("域名必须以/结束");
            return;
          }
          if (this.ossConfigVo.maxSize>1000) {
            layer.alert("文件大小在0-999M之内");
            return;
          }

          save(this.ossConfigVo)
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
      this.ossConfigVo = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let domain = this.ossConfigVo.path_prefix;
          if (domain.substr(domain.length - 1) != "/") {
            layer.alert("域名必须以/结束");
            return;
          }
          if (this.ossConfigVo.maxSize>1000) {
            layer.alert("文件大小在0-999M之内");
            return;
          }
          
          const prjVoData = Object.assign({}, this.ossConfigVo);
          update(prjVoData).then(response => {
            layer.alert(response.data.msg);
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
        "是否确定删除此项目【如已有项目已使用此项，将会造成无法上传】",
        { btn: ["确定", "取消"], title: "提示" },
        () => {
          del(row.id)
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

