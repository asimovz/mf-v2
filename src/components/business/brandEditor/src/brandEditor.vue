<template>
  <div class="m-brand-editor">
    <div class="brand-left">
      <div class="preview">
        <div class="content">
          <div class="header">
            <span class="logo">
              <img v-if="!logoUrl" src="./static/logo.png" alt class="logo-img" />
              <img v-else :src="logoUrl" alt class="logo-img" />
            </span>
            <span class="title">{{brandNameVal}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="brand-right">
      <div class="brand-list">
        <div class="list-item">
          <label class="item-label">
            <span class="text-require">{{brandTypeLabel}}</span>
          </label>
          <drop-down
            class="item-form"
            :form="form"
            :name="data.brandTypeName"
            :filterable="false"
            :options="brandTypeOptions"
            :validate="brandTypeValidate"
            v-model="brandTypeVal"
            validate-msg="不能为空"
            placeholder="请选择"
          ></drop-down>
        </div>
        <div class="list-item">
          <label class="item-label">
            <span class="text-require">{{brandNameLabel}}</span>
          </label>
          <m-input
            class="item-form"
            :form="form"
            :name="data.brandName"
            :validate="brandNameValidate"
            validate-msg="不能为空"
            v-model="brandNameVal"
            placeholder="请输入"
          />
        </div>
        <div class="list-item">
          <label class="item-label">
            <span class="text-require">{{brandLogoLabel}}</span>
          </label>
          <div class="upload-container">
            <div class="upload-box">
              <div class="upload-item">
                <m-file
                  class="file-item"
                  :form="form"
                  id="whiteLogoId"
                  :name="data.whiteLogoName"
                  :size="size"
                  :type="type"
                  :text="text"
                  :maxSize="100"
                  :files="data.whiteFiles"
                  format="jpg,png"
                  :validate="whiteLogoValidate"
                  validateMsg="不能为空"
                  @fileList="logoPreview"
                ></m-file>
              </div>
              <div class="upload-item">
                <m-file
                  class="file-item"
                  :form="form"
                  id="colorLogoId"
                  :name="data.colorLogoName"
                  :size="size"
                  :type="type"
                  :text="text"
                  :maxSize="100"
                  :files="data.colorFiles"
                  format="jpg,png"
                  :validate="colorLogoValidate"
                  validateMsg="不能为空"
                ></m-file>
              </div>
            </div>
            <div class="upload-desc">
              <div>图片规范：</div>
              <div>1. 图片尺寸：400*400px</div>
              <div>2. 图片大小：不超过100KB</div>
              <div>3. 需同时提供原色白底logo（png格式）和反白彩底logo（jpg格式）</div>
            </div>
            <div class="upload-example">
              <div class="example-item">
                <div>图片示例：</div>
                <img src="./static/white.png" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="list-item">
          <label class="item-label">
            <span class="text-require">短信签名</span>
          </label>
          <m-tags
            class="item-form"
            :form="form"
            id="tagId"
            :data="data.tagData"
            :name="data.tagName"
            :validate="tagValidate"
            validateMsg="不能为空"
          ></m-tags>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "m-brand-editor",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    brandTypeOptions: Array,
    form: String
  },

  data() {
    return {
      brandTypeVal: this.data.brandTypeValue,
      brandNameVal: this.data.brandNameValue,

      brandTypeLabel: "公众号类型",
      brandTypeValidate: "required",
      brandNameLabel: "公众号名称",
      brandNameValidate: "required",
      brandLogoLabel: "公众号LOGO",
      whiteLogoValidate: "required",
      colorLogoValidate: "required",
      tagValidate: {
        required: true
      },
      type: "card",
      text: "上传文件",
      size: "100",
      logoUrl: this.data.whiteFiles || ""
    };
  },
  methods: {
    logoPreview(val) {
      this.logoUrl = val[0];
    }
  }
};
</script>
<style lang="scss" scoped>
.m-brand-editor {
  height: 100%;
  display: flex;
  background: #fff;

  .brand-left {
    flex: 1;
    .preview {
      .content {
        position: relative;
        margin: 0 auto;
        width: 380px;
        height: 560px;
        border: 1px solid #ccc;
        background: url(./static/phone.jpg) no-repeat;

        .header {
          position: absolute;
          top: 30px;
          width: 100%;
          height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;

          .logo {
            display: inline-block;
            height: 37px;
            width: 37px;
            background: #f7f7f7;
            // background: url(./static/logo.png) no-repeat;

            .logo-img {
              height: 37px;
              width: 37px;
              border-radius: 50%;
            }
          }

          .title {
            padding-left: 12px;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .brand-right {
    flex: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .brand-list {
      display: flex;
      flex-direction: column;
      .list-item {
        display: flex;
        // justify-content: space-between;
        padding: 6px;

        .item-label {
          width: 100px;
          text-align: right;
          line-height: 32px;
        }

        .item-form {
          width: 400px;
          display: table;
          height: 50px;
          padding-left: 12px;
        }

        .upload-container {
          flex: 3;
          padding-left: 12px;
          display: flex;
          flex-direction: column;

          .upload-box {
            display: flex;

            .upload-item {
              position: relative;
              width: 100px;
              margin-right: 12px;
              height: 110px;

              .file-item {
              }

              .logo-desc {
                position: absolute;
                bottom: 0;
                width: 100%;
                text-align: center;
              }
            }
          }

          .upload-desc {
            padding-top: 12px;
          }

          .upload-example {
            display: flex;
            padding-top: 12px;
          }
        }
      }
    }

    .brand-button-bar {
      display: flex;
      padding: 16px;

      .button-item {
        margin-right: 12px;
      }
    }
  }
}
.text-require:before {
  top: 10px;
  left: -12px;
}
</style>