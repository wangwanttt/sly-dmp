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
      <el-table-column align="center" label="ID" width="210">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="项目名称" width="200">
        <template slot-scope="scope">{{ scope.row.name |prjNameFilter}}</template>
      </el-table-column>
      <el-table-column label="AppId" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="subject" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subject}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payWay|payWayFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="私钥" width="210" align="center">
        <template slot-scope="scope">{{ scope.row.priKey }}</template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="微信商户号" width="210" align="center">
        <template slot-scope="scope">{{ scope.row.mchId }}</template>
      </el-table-column>

      <el-table-column label="公钥" :show-overflow-tooltip="true" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.pubKey }}</template>
      </el-table-column>
      <!-- <el-table-column label="网关地址" :show-overflow-tooltip="true" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gateWay }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="回调地址" :show-overflow-tooltip="true" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.callFunc }}</template>
      </el-table-column>
      <el-table-column label="访问ip" :show-overflow-tooltip="true" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.ip }}</template>
      </el-table-column>
      <el-table-column label="备注" :show-overflow-tooltip="true" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="110">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="'支付项目编辑'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="prjVo" label-position="left">
        <!-- <el-form-item label="项目名称" prop="name">
          <el-input v-model="prjVo.name" :disabled="dialogStatus!='create'" />
        </el-form-item>-->
        <el-form-item label="项目选择" prop="location">
          <!-- <el-input v-model="dataForm.location" maxlength="20"></el-input> -->
          <el-select placeholder="请选择" v-model="prjVo.name" clearable>
            <el-option
              class="cateClass"
              v-for="(item,index) in prjGrpList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="appid" prop="appid">
          <el-input v-model="prjVo.appid" />
        </el-form-item>
        <div style="display:flex">
          <el-form-item label="支付类型" prop="payType" style="padding-right:10px;">
            <el-select v-model="prjVo.payType" class="filter-item"  @change="selectTrigger(prjVo.payWay)">
              <el-option
                v-for="item in payType"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="payWay">
            <el-select
              v-model="prjVo.payWay"
              class="filter-item" 
            >
              <el-option
                v-for="item in wayArr"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <template v-if="prjVo.payType==2">
          <el-form-item label="商户号">
            <el-input placeholder="商户号" maxlength="60" v-model="prjVo.mchId"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="私钥" prop="priKey">
          <el-input
            type="textarea"
            maxlength="2000"
            :autosize="{ minRows: 4, maxRows: 10}"
            placeholder="支付宝私钥/微信应用对应的凭证APP_SECRET"
            v-model="prjVo.priKey"
          ></el-input>
        </el-form-item>

        <el-form-item label="公钥" prop="pubKey">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="2000"
            placeholder="支付宝是公钥/商户号支付密钥(key)"
            :autosize="{ minRows: 4, maxRows: 10}"
            v-model="prjVo.pubKey"
          ></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="网关">
          <el-input placeholder="支付宝网关或微信无" maxlength="60" v-model="prjVo.gateWay"></el-input>
        </el-form-item>-->

        <el-form-item label="回调" prop="callFunc">
          <el-input placeholder="此支付中心调用你的应用地址" maxlength="60" v-model="prjVo.callFunc"></el-input>
        </el-form-item>

        <el-form-item label="访问ip" prop="ip">
          <el-input placeholder="进行支付的前端web服务器的IP地址" maxlength="60" v-model="prjVo.ip"></el-input>
        </el-form-item>

        <el-form-item label="订单标题" prop="subject">
          <el-input placeholder="30字以内" maxlength="30" v-model="prjVo.subject"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="prjVo.remark" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" />
        </el-form-item>
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
import { getList, getGrpList, savePrj, delPrj, updatePrj } from "@/api/project";
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
    },
    payWayFilter: value => {
      let payObj = that.payWay.filter(payObj => {
        return payObj.id == value;
      });

      return payObj[0].label;
    },
    payTypeFilter: value => {
      let payObj = that.payType.filter(payObj => {
        return payObj.id == value;
      });
      return payObj[0].label;
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
      payType: [
        {
          id: 1,
          label: "支付宝"
        },
        {
          id: 2,
          label: "微信"
        }
      ],
      payAliWay: [
        {
          id: 11,
          label: "支付宝电脑网站支付"
        },
        {
          id: 12,
          label: "支付宝手机网站支付"
        },
        {
          id: 13,
          label: "支付宝 APP 支付"
        }],
        payWxWay:[
        {
          id: 21,
          label: "微信 NATIVE 支付(二维码支付)"
        },
        {
          id: 22,
          label: "微信 JSAPI 支付"
        },
        {
          id: 23,
          label: "微信 H5 支付"
        },
        {
          id: 24,
          label: "微信 APP 支付"
        },
        {
          id: 25,
          label: "微信 小程序 支付"
        }
      ],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "create",
      prjList: [],
      prjGrpList: [],
      wayArr:[],
      prjVo: {
        payType: 1,
        payWay: 11,
        name: "",
        remark:""
      },
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "change" }
        ],
        appid: [
          { required: true, message: "appid不能为空", trigger: "change" }
        ],
        priKey: [
          { required: true, message: "私钥不能为空", trigger: "change" }
        ],
        // pubKey: [
        //   { required: true, message: "公钥不能为空", trigger: "change" }
        // ],
        callFunc: [
          { required: true, message: "回调地址不能为空", trigger: "change" }
        ],
        subject: [
          { required: true, message: "订单标题不能为空", trigger: "change" }
        ],
        ip: [{ required: true, message: "访问IP不能为空", trigger: "change" }]
      }
    };
  },

  created() {
    that = this;
    this.getPrjGrpData();
    this.payWay=this.payAliWay.concat(this.payWxWay);
    this.wayArr=this.payAliWay;
  },

  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then(response => {
        this.prjList = response.data;
        this.listLoading = false;
      });
    },
    getPrjGrpData() {
      this.listLoading = true;
      getGrpList().then(response => {
        this.prjGrpList = response.data;
        this.prjVo.name = this.prjGrpList[0].id;
        this.listLoading = false;
        this.fetchData();
      });
    },
    selectTrigger(val) {
      if (this.prjVo.payType==1)
         this.wayArr=this.payAliWay;
      else
        this.wayArr=this.payWxWay;

        this.prjVo.payWay=this.wayArr[0].id;
    },

    addPrj() {
      //  this.resetprjVo()
      this.dialogStatus = "create";

      this.prjVo["payType"] = 1;
      this.prjVo["payWay"] = 11;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    submitForm() {
      this.listLoading = true;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          savePrj(this.prjVo)
            .then(response => {
              this.listLoading = false;
              layer.alert(response.data.msg);
              if (response.data.code < 1) {
                return;
              }
              this.fetchData();
            })
            .catch(error => {
              this.listLoading = false;
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
          updatePrj(prjVoData).then(response => {
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
        "是否确定删除此支付项目【如已有项目已使用此项，将会造成无法支付】",
        { btn: ["确定", "取消"], title: "提示" },
        () => {
          delPrj(row.id)
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

