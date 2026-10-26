const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve, dirname } = require("node:path");
const { Module } = require("node:module");
const ts = require("typescript");
const React = require("react");

function compile(source, filename) {
  return ts.transpileModule(source, {fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
}
for(const ext of [".ts",".tsx"])require.extensions[ext]=(loaded,filename)=>loaded._compile(compile(readFileSync(filename,"utf8"),filename),filename);

function nodes(node, result=[]) {
  React.Children.forEach(node,child=>{if(React.isValidElement(child)){result.push(child);nodes(child.props.children,result);}});
  return result;
}
function harness(initial={}) {
  let props={label:"Capa",variant:"portrait",...initial};
  const slots=[], effects=[];let cursor=0;
  const Editor=()=>null;
  const hooks={...React,lazy:()=>Editor,
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==="function"?initial():initial;return[slots[i],value=>{slots[i]=typeof value==="function"?value(slots[i]):value}];},
    useRef(initial){const i=cursor++;return slots[i]??=( {current:initial} );},
    useEffect(fn,deps){const i=cursor++;const old=slots[i];if(!old||deps.some((value,j)=>!Object.is(value,old.deps[j])))effects.push(()=>{old?.cleanup?.();slots[i]={deps,cleanup:fn()};});},
  };
  const filename=resolve(__dirname,"../src/admin/components/AdminImageUpload/index.tsx");
  const loaded=new Module(filename,module), localRequire=Module.createRequire(filename);
  loaded.filename=filename;loaded.paths=Module._nodeModulePaths(dirname(filename));
  loaded.require=name=>name==="react"?hooks:localRequire(name);
  loaded._compile(compile(readFileSync(filename,"utf8"),filename),filename);
  function render(){cursor=0;const tree=nodes(loaded.exports.AdminImageUpload(props));while(effects.length)effects.shift()();return tree;}
  const styles=localRequire("./styles");
  return {
    render,
    update(next){props={...props,...next};return render();},
    select(file){const input=render().find(node=>node.props.type==="file");const target={files:file?[file]:[],value:"selected"};input.props.onChange({target});assert.equal(target.value,"");return render().find(node=>node.type===Editor);},
    editor(){return render().find(node=>node.type===Editor);},
    edit(){const button=render().find(node=>node.type===styles.EditButton);assert.ok(button);button.props.onClick();return this.editor();},
    unmount(){for(const value of slots)value?.cleanup?.();},
  };
}
const settings={area:{x:10,y:20,width:50,height:60},rotation:90};
const original=()=>new File(["original source"],"capa.jpg",{type:"image/jpeg"});
const cropped=()=>new File(["cropped output"],"capa-recorte.jpg",{type:"image/jpeg"});

test("selecting or cancelling an image never uploads the original file",()=>{
  const uploads=[];const form=harness({onChange:async file=>uploads.push(file)});
  const source=original(),editor=form.select(source);
  assert.equal(editor.props.file,source);assert.deepEqual(uploads,[]);
  editor.props.onCancel();assert.equal(form.editor(),undefined);assert.deepEqual(uploads,[]);
  assert.ok(form.select(source),"the same file can be selected again after cancel");form.unmount();
});

test("only the confirmed cropped file reaches the existing upload callback",async()=>{
  const uploads=[];const form=harness({onChange:async file=>{uploads.push(file);return"https://example.org/capa.jpg";}});
  const editor=form.select(original()),output=cropped();
  await editor.props.onApply(output,settings);
  assert.deepEqual(uploads,[output]);assert.equal(form.editor(),undefined);form.unmount();
});

test("adjusting again restores the full original and the previous crop instead of cropping an already cropped file",async()=>{
  const url="https://example.org/capa.jpg",source=original();
  const form=harness({onChange:async()=>url});
  await form.select(source).props.onApply(cropped(),settings);form.update({imageUrl:url});
  const editor=form.edit();
  assert.equal(editor.props.file,source);assert.deepEqual(editor.props.initialSettings,settings);form.unmount();
});

test("a failed upload keeps the editor open and can retry the same crop",async()=>{
  let attempts=0;const form=harness({onChange:async()=>{if(++attempts===1)throw new Error("Connection failed");return"https://example.org/capa.jpg";}});
  const source=original(),output=cropped();
  await assert.rejects(form.select(source).props.onApply(output,settings),/Connection failed/);
  assert.equal(form.editor().props.file,source);
  await form.editor().props.onApply(output,settings);assert.equal(form.editor(),undefined);assert.equal(attempts,2);form.unmount();
});

test("invalid files show a field error without opening or uploading",()=>{
  const form=harness({onChange:async()=>{throw new Error("Must not upload");}});
  assert.equal(form.select(new File(["pdf"],"documento.pdf",{type:"application/pdf"})),undefined);
  assert.equal(form.render()[0].props.error,"Selecione um arquivo de imagem.");form.unmount();
});

test("temporary preview URLs are released when the upload component unmounts",async context=>{
  const file=cropped(),url=URL.createObjectURL(file),revoked=[];
  context.mock.method(URL,"revokeObjectURL",value=>revoked.push(value));
  const form=harness({onChange:async()=>url});await form.select(original()).props.onApply(file,settings);
  form.update({imageUrl:url});assert.deepEqual(revoked,[]);form.unmount();assert.deepEqual(revoked,[url]);
});
