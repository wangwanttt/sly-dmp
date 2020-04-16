<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @submit.native.prevent
      label-width="80px"
    >
      <el-form-item label="所属项目" prop="used">
        <el-select v-model="dataForm.prjId" placeholder="请选择用途">
          <el-option
            class="cateClass"
            v-for="(item,index) in prjGrpList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="模板标题" type="text" maxlength="40" />
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input
          type="textarea"
          v-model="dataForm.content"
          placeholder="模板内容,占位使用 %s 占位"
          maxlength="100"
        />
      </el-form-item>

      <el-form-item label="前端标志" prop="flag">
        <el-input v-model.number="dataForm.flag"   maxlength="3"></el-input>
      </el-form-item>
  <el-form-item label="模板内容" prop="remark">
        <el-input
          type="textarea"
          v-model="dataForm.remark"
          placeholder="对前端标志做的约定描述"
          maxlength="100"
        />
      </el-form-item>

      <el-form-item label="消息类型" size="mini" prop="type" @change="updateChecked">
        <el-radio-group v-model="radioValue" size="mini"> 
          <el-radio label="0">通知</el-radio>
           <el-radio label="1">消息</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div style="margin:10px">
      <p>消息：后台将会推送给前端未读消息条数, 通知：前端收到通知，进行弹出提示</p>
      <p>
        前端标志：如果前端收到的是通知，则前端收到此消息后应该怎么处理，
        <br />如0-不处理 1-是前端收到的是订单消息 2--审核信息，后台还会通过extra字段将id等过来
      </p>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getGrpList, list, save, del, update } from "@/api/tplMgr";

export default {
  name: "temp-add-update",
  data() {
    return {
      radioValue: 1,
      dataForm: {},
      prjGrpList: {},
      flag: 0, //0--新增 1--编辑
      dataRule: {
        title: [{ required: true, message: "请输入模板标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ]
      },
      visible: true
      //  options: [{ label: "商品发货", value: 10 }]
    };
  },
  methods: {
    init(data, _prjGrpList) {
      this.visible = true;
      this.prjGrpList = _prjGrpList;

      this.dataForm = data || {};

      if (data.type) {
        this.flag = 1;
       
        this.radioValue = data.type.toString();
      } else this.radioValue = "1";
    },
    dataFormSubmit() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dataForm.type = this.radioValue;
          debugger
          if (this.flag == 1) {
            update(this.dataForm).then(({ data }) => {
              if (data.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          } else {
            save(this.dataForm).then(({ data }) => {
              if (data.code === 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    updateChecked(val) {
      this.dataForm.type = val;
    }
  }
};
</script>

<style scoped>
</style>
