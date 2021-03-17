<template>
  <div class="problem">

    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item prop="_id" :label="$t('m.Display_ID')"
                          :required="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem'">
              <el-input :placeholder="$t('m.Display_ID')" v-model="problem._id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="title" :label="$t('m.Title')" required>
              <el-input :placeholder="$t('m.Title')" v-model="problem.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item  :label="$t('m.Prob_Score')" required>
              <el-input :placeholder="100" v-model="problem.score"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Prob_File')" :error="error.testcase" required>
              <el-upload
                action="/api/admin/test_case"
                name="file"
                :data="{spj: problem.spj}"
                :show-file-list="true"
                :on-success="uploadSucceeded"
                :on-error="uploadFailed">
                <el-button size="small" type="primary" icon="el-icon-fa-upload">Choose File</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('m.Build_Options')">
              <el-input :placeholder="$t('m.Build_Options_Desc')" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Mitigations')" :error="error.languages" required>
              <el-tooltip class="spj-radio"  v-for="miti in mitigations" :key="miti" :content="miti" effect="dark" placement="top-start">
                  <el-checkbox :label="miti"></el-checkbox>
                </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('m.Build_Template')">
          <el-row>
            <el-col :span="24" v-for="(v, k) in template" :key="'template'+k">
              <el-form-item>
                <el-checkbox v-if="k==='C'" v-model="v.checked"> Makefile Template </el-checkbox>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>



        <div>
          <el-form-item v-for="(sample, index) in problem.samples" :key="'sample'+index">
            <Accordion v-if="index < 4" :title="'Setting for Evaluation Point ' + (index + 1)">
              <el-button type="warning" size="small" icon="el-icon-delete" slot="header" @click="deleteSample(index)">
                Delete
              </el-button>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item :label="$t('m.Hint')" required>
                    <el-input
                      :rows="3"
                      type="textarea"
                      :placeholder="$t('m.Hint_Placeholder')"
                      v-model="sample.input">
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item :label="$t('m.Difficulty')" required>
                    <el-select class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')" v-model="problem.difficulty">
                      <el-option :label="$t('m.Low')" value="Low"></el-option>
                      <el-option :label="$t('m.Mid')" value="Mid"></el-option>
                      <el-option :label="$t('m.High')" value="High"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===0">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Knowledge_Type_Ep1')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep1_know in ep1_knowledges" :key="ep1_know" :content="ep1_know" effect="dark" placement="top-start">
                        <el-checkbox :label="ep1_know"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===0">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Skill_Type_Ep1')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep1_s in ep1_skills" :key="ep1_s" :content="ep1_s" effect="dark" placement="top-start">
                        <el-checkbox :label="ep1_s"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===1">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Knowledge_Type_Ep2')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep2_know in ep2_knowledges" :key="ep2_know" :content="ep2_know" effect="dark" placement="top-start">
                        <el-checkbox :label="ep2_know"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===1">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Skill_Type_Ep2')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep2_s in ep2_skills" :key="ep2_s" :content="ep2_s" effect="dark" placement="top-start">
                        <el-checkbox :label="ep2_s"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===2">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Knowledge_Type_Ep3')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep3_know in ep3_knowledges" :key="ep3_know" :content="ep3_know" effect="dark" placement="top-start">
                        <el-checkbox :label="ep3_know"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===2">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Skill_Type_Ep3')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep3_s in ep3_skills" :key="ep3_s" :content="ep3_s" effect="dark" placement="top-start">
                        <el-checkbox :label="ep3_s"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="index===3">
                <el-col :span="20">
                  <el-form-item :label="$t('m.Knowledge_Type_Ep4')" :error="error.languages" required>
                    <el-tooltip class="spj-radio"  v-for="ep4_know in ep4_knowledges" :key="ep4_know" :content="ep4_know" effect="dark" placement="top-start">
                        <el-checkbox :label="ep4_know"></el-checkbox>
                      </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-row>

            </Accordion>
          </el-form-item>
        </div>
        <div class="add-sample-btn">
          <button type="button" class="add-samples" @click="addSample()"><i class="el-icon-plus"></i>{{$t('m.Add_Sample')}}
          </button>
        </div>
        


        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="description" :label="$t('m.Problem_Description')" required>
              <Simditor v-model="problem.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>




        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item v-if="test" prop="input_description" :label="$t('m.Input_Description')" required>
              <Simditor v-model="problem.input_description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="test" prop="output_description" :label="$t('m.Output_Description')" required>
              <Simditor v-model="problem.output_description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('m.Time_Limit') + ' (ms)' " required>
              <el-input type="Number" :placeholder="$t('m.Time_Limit')" v-model="problem.time_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Memory_limit') + ' (MB)' " required>
              <el-input type="Number" :placeholder="$t('m.Memory_limit')" v-model="problem.memory_limit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Difficulty')">
              <el-select class="difficulty-select" size="small" :placeholder="$t('m.Difficulty')" v-model="problem.difficulty">
                <el-option :label="$t('m.Low')" value="Low"></el-option>
                <el-option :label="$t('m.Mid')" value="Mid"></el-option>
                <el-option :label="$t('m.High')" value="High"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item :label="$t('m.Visible')">
              <el-switch
                v-model="problem.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="$t('m.ShareSubmission')">
              <el-switch
                v-model="problem.share_submission"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('m.Tag')" :error="error.tags" required>
              <span class="tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag"
                  type="success"
                  @close="closeTag(tag)"
                >{{tag}}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                v-model="tagInput"
                :trigger-on-focus="false"
                @keyup.enter.native="addTag"
                @blur="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <save @click.native="submit()">Save and Deploy</save>
      </el-form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Accordion from '../../components/Accordion'
  import CodeMirror from '../../components/CodeMirror'
  import api from '../../api'

  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror
    },
    data () {
      return {
        rules: {
          _id: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'},
          input_description: {required: true, message: 'Input Description is required', trigger: 'blur'},
          output_description: {required: true, message: 'Output Description is required', trigger: 'blur'}
        },
        loadingCompile: false,
        mode: '',
        contest: {},
        test_tags: [],
        problem: {
          languages: [],
          io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
        },
        reProblem: {
          languages: [],
          io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
        },
        testCaseUploaded: false,
        allLanguage: {},
        mitigations: ['NX', 'ASLR', 'SSP'],
        ep1_knowledges: ['c', 'c++', 'x86', 'x86-64', 'arm', 'mips', 'buffer overflow', 'use after free', 'heap overflow', 'integer overflow', 'type confusion'],
        ep1_skills: ['debugging', 'symbolic execution', 'deassemble', 'decompile', 'taint analysis', 'fuzzing', 'deobfuscation'],
        ep2_knowledges: ['v-table', 'return address', 'global offset table', 'function pointer'],
        ep2_skills: ['shellcoding'],
        ep3_knowledges: ['W⊕X', 'DEP', 'NX', 'ASLR', 'Stack Protector'],
        ep3_skills: ['return oriented programming', 'jump oriented programming', 'return to csu', 'return to library', 'return to dynamic resolve', 'stack pivot', 'oneshot gadget', 'libc leak'],
        ep4_knowledges: ['system command', 'flag format'],
        ep4_skills: [''],
        inputVisible: false,
        tagInput: '',
        template: {},
        title: '',
        spjMode: '',
        disableRuleType: false,
        test: false,
        knowledge_auditing: '',
        knowledge_reversing: '',
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: ''
        }
      }
    },
    mounted () {
      this.routeName = this.$route.name
      if (this.routeName === 'edit-problem' || this.routeName === 'edit-contest-problem') {
        this.mode = 'edit'
      } else {
        this.mode = 'add'
      }
      api.getLanguages().then(res => {
        this.problem = this.reProblem = {
          _id: '',
          title: '',
          description: '',
          input_description: '',
          output_description: '',
          time_limit: 1000,
          memory_limit: 256,
          difficulty: 'Low',
          visible: true,
          share_submission: false,
          tags: [],
          languages: [],
          template: {},
          samples: [{input: '', output: ''}],
          spj: false,
          spj_language: '',
          spj_code: '',
          spj_compile_ok: false,
          test_case_id: '',
          test_case_score: [],
          rule_type: 'ACM',
          hint: '',
          source: '',
          io_mode: {'io_mode': 'Standard IO', 'input': 'input.txt', 'output': 'output.txt'}
        }
        let contestID = this.$route.params.contestId
        if (contestID) {
          this.problem.contest_id = this.reProblem.contest_id = contestID
          this.disableRuleType = true
          api.getContest(contestID).then(res => {
            this.problem.rule_type = this.reProblem.rule_type = res.data.data.rule_type
            this.contest = res.data.data
          })
        }

        this.problem.spj_language = 'C'

        let allLanguage = res.data.data
        this.allLanguage = allLanguage

        // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
        if (this.mode === 'edit') {
          this.title = this.$i18n.t('m.Edit_Problem')
          let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
          api[funcName](this.$route.params.problemId).then(problemRes => {
            let data = problemRes.data.data
            if (!data.spj_code) {
              data.spj_code = ''
            }
            data.spj_language = data.spj_language || 'C'
            this.problem = data
            this.testCaseUploaded = true
          })
        } else {
          this.title = this.$i18n.t('m.Add_Problem')
          for (let item of allLanguage.languages) {
            this.problem.languages.push(item.name)
          }
        }
      })
    },
    watch: {
      '$route' () {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
      },
      'problem.languages' (newVal) {
        let data = {}
        // use deep copy to avoid infinite loop
        let languages = JSON.parse(JSON.stringify(newVal)).sort()
        for (let item of languages) {
          if (this.template[item] === undefined) {
            let langConfig = this.allLanguage.languages.find(lang => {
              return lang.name === item
            })
            // console.log(langConfig)
            if (this.problem.template[item] === undefined) {
              data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
              if (item === 'C') {
                // data["c"] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
                data[item].code = api.dontIndent(`#PREPEND BEGIN
                                          MITIGATIONS="" #Generated by Internal Logic
                                          CXX_FLAGS="" #Build Flags given by user
                                          #PREPEND END

                                          #TEMPLATE BEGIN
                                          TARGETS="prob"
                                          CXX="clang"
                                          CC="clang"

                                          TARGETS: $(TARGETS).cpp
                                          @echo Compiling $< to $@
                                          @$(CXX) $(CXXFLAGS) -o $@ $<
                                          #TEMPLATE END

                                          #APPEND BEGIN
                                          clean:
                                              rm -rf $(TARGETS)
                                          
                                          .PHONY: clean all
                                          #APPEND END`)
                console.log(langConfig.config.template)
              }
            } else {
              data[item] = {checked: true, code: this.problem.template[item], mode: langConfig.content_type}
            }
          } else {
            data[item] = this.template[item]
          }
        }
        this.template = data
        console.log(this.template)
      },
      'problem.spj_language' (newVal) {
        this.spjMode = this.allLanguage.spj_languages.find(item => {
          return item.name === this.problem.spj_language
        }).content_type
      }
    },
    methods: {
      switchSpj () {
        if (this.testCaseUploaded) {
          this.$confirm('If you change problem judge method, you need to re-upload test cases', 'Warning', {
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.problem.spj = !this.problem.spj
            this.resetTestCase()
          }).catch(() => {
          })
        } else {
          this.problem.spj = !this.problem.spj
        }
      },
      querySearch (queryString, cb) {
        api.getProblemTagList().then(res => {
          let tagList = []
          for (let tag of res.data.data) {
            tagList.push({value: tag.name})
          }
          cb(tagList)
        }).catch(() => {
        })
      },
      resetTestCase () {
        this.testCaseUploaded = false
        this.problem.test_case_score = []
        this.problem.test_case_id = ''
      },
      addTag () {
        let inputValue = this.tagInput
        if (inputValue) {
          this.problem.tags.push(inputValue)
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      addSample () {
        this.problem.samples.push({input: '', output: ''})
      },
      deleteSample (index) {
        this.problem.samples.splice(index, 1)
      },
      uploadSucceeded (response) {
        if (response.error) {
          this.$error(response.data)
          return
        }
        let fileList = response.data.info
        for (let file of fileList) {
          file.score = (100 / fileList.length).toFixed(0)
          if (!file.output_name && this.problem.spj) {
            file.output_name = '-'
          }
        }
        this.problem.test_case_score = fileList
        this.testCaseUploaded = true
        this.problem.test_case_id = response.data.id
      },
      uploadFailed () {
        this.$error('Upload failed')
      },
      compileSPJ () {
        let data = {
          id: this.problem.id,
          spj_code: this.problem.spj_code,
          spj_language: this.problem.spj_language
        }
        this.loadingCompile = true
        api.compileSPJ(data).then(res => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = true
          this.error.spj = ''
        }, err => {
          this.loadingCompile = false
          this.problem.spj_compile_ok = false
          const h = this.$createElement
          this.$msgbox({
            title: 'Compile Error',
            type: 'error',
            message: h('pre', err.data.data),
            showCancelButton: false,
            closeOnClickModal: false,
            customClass: 'dialog-compile-error'
          })
        })
      },
      submit () {
        if (!this.problem.samples.length) {
          this.$error('Sample is required')
          return
        }
        for (let sample of this.problem.samples) {
          if (!sample.input || !sample.output) {
            this.$error('Sample input and output is required')
            return
          }
        }
        if (!this.problem.tags.length) {
          this.error.tags = 'Please add at least one tag'
          this.$error(this.error.tags)
          return
        }
        if (this.problem.spj) {
          if (!this.problem.spj_code) {
            this.error.spj = 'Spj code is required'
            this.$error(this.error.spj)
          } else if (!this.problem.spj_compile_ok) {
            this.error.spj = 'SPJ code has not been successfully compiled'
          }
          if (this.error.spj) {
            this.$error(this.error.spj)
            return
          }
        }
        if (!this.problem.languages.length) {
          this.error.languages = 'Please choose at least one language for problem'
          this.$error(this.error.languages)
          return
        }
        if (!this.testCaseUploaded) {
          this.error.testCase = 'Test case is not uploaded yet'
          this.$error(this.error.testCase)
          return
        }
        if (this.problem.rule_type === 'OI') {
          for (let item of this.problem.test_case_score) {
            try {
              if (parseInt(item.score) <= 0) {
                this.$error('Invalid test case score')
                return
              }
            } catch (e) {
              this.$error('Test case score must be an integer')
              return
            }
          }
        }
        this.problem.languages = this.problem.languages.sort()
        this.problem.template = {}
        for (let k in this.template) {
          if (this.template[k].checked) {
            this.problem.template[k] = this.template[k].code
          }
        }
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.contest_id = this.contest.id
        }
        api[funcName](this.problem).then(res => {
          if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
            this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
          } else {
            this.$router.push({name: 'problem-list'})
          }
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }

  }
</style>

<style>
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
</style>

