const APP_LANG = document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "zh";
const IS_EN = APP_LANG === "en";
const APP_VERSION = "0.9.7";
const NODE_INDEX_VERSION = "sidefx-seed-2026-05-18";
const WORKSPACE_SCHEMA = "houdini-node-atlas-workspace";
const WORLD_WIDTH = 5000;
const WORLD_HEIGHT = 5000;
const NODE_WIDTH = 214;
const NODE_HEIGHT = 110;
const PORT_COUNT_MAX = 4;
const IMPORT_NODE_GAP_X = 310;
const IMPORT_NODE_GAP_Y = 165;
const AUTOSAVE_DELAY = 650;
const VERSION_CLICK_TARGET = 5;
const VERSION_CLICK_WINDOW = 1500;
const NOTE_IMAGE_MAX = 6;
const NOTE_IMAGE_MAX_EDGE = 900;
const OCR_IMAGE_MAX_EDGE = 1400;
const OPFS_WORKSPACE_FILE = APP_LANG === "en" ? "houdini-node-atlas-workspace-en.json" : "houdini-node-atlas-workspace-cn.json";
const HISTORY_LIMIT = 80;
const BOARD_NOTE_WIDTH = 220;
const BOARD_NOTE_HEIGHT = 140;
const PORT_SNAP_RADIUS = 38;

function tr(zh, en) {
  return IS_EN ? en : zh;
}

const COLOR_POOL = [
  "#ff4f24",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#94a3b8",
];

const HOU_CONTEXTS = [
  { id: "OBJ", name: "OBJ", color: "#8b95a1" },
  { id: "SOP", name: "SOP", color: "#3b82f6" },
  { id: "DOP", name: "DOP", color: "#a855f7" },
  { id: "VOP", name: "VOP", color: "#14b8a6" },
  { id: "LOP", name: "LOP", color: "#eab308" },
  { id: "ROP", name: "ROP", color: "#ef4444" },
  { id: "CHOP", name: "CHOP", color: "#06b6d4" },
  { id: "COP", name: "COP", color: "#ec4899" },
  { id: "TOP", name: "TOP", color: "#22c55e" },
  { id: "APEX", name: "APEX", color: "#f97316" },
];

const SEEDED_NODE_LIBRARY = [
  {
    type: "geo",
    label: "Geometry",
    group: "OBJ",
    color: "#6b7280",
    params: [
      ["path", "/obj/geo1"],
      ["display", "on"],
    ],
  },
  {
    type: "camera",
    label: "Camera",
    group: "OBJ",
    color: "#8b95a1",
    params: [
      ["focal", "50"],
      ["resolution", "1920x1080"],
    ],
  },
  {
    type: "hlight",
    label: "Light",
    group: "OBJ",
    color: "#d6a034",
    params: [
      ["light_type", "area"],
      ["exposure", "0"],
    ],
  },
  {
    type: "box",
    label: "Box",
    group: "SOP",
    color: "#59666f",
    params: [
      ["size", "1, 1, 1"],
      ["type", "polygon"],
    ],
  },
  {
    type: "file",
    label: "File",
    group: "SOP",
    color: "#3b6f9e",
    params: [
      ["file", "$HIP/geo/cache.bgeo.sc"],
      ["load", "Packed Disk"],
    ],
  },
  {
    type: "filecache",
    label: "File Cache",
    group: "SOP",
    color: "#3b6f9e",
    params: [
      ["file", "$HIP/geo/$OS.$F4.bgeo.sc"],
      ["loadfromdisk", "on"],
    ],
  },
  {
    type: "transform",
    label: "Transform",
    group: "SOP",
    color: "#687782",
    params: [
      ["translate", "0, 0, 0"],
      ["rotate", "0, 0, 0"],
    ],
  },
  {
    type: "attribwrangle",
    label: "Attrib Wrangle",
    group: "SOP",
    color: "#c2572a",
    params: [
      ["runover", "Points"],
      ["snippet", "@Cd = relbbox(0, @P);"],
    ],
  },
  {
    type: "mountain",
    label: "Mountain",
    group: "SOP",
    color: "#59666f",
    params: [
      ["height", "0.35"],
      ["element_size", "1.8"],
    ],
  },
  {
    type: "attribnoise",
    label: "Attribute Noise",
    group: "SOP",
    color: "#c2572a",
    params: [
      ["attribute", "Cd"],
      ["amplitude", "1"],
    ],
  },
  {
    type: "groupexpression",
    label: "Group Expression",
    group: "SOP",
    color: "#7c8a96",
    params: [
      ["group", "selection"],
      ["snippet", "@P.y > 0"],
    ],
  },
  {
    type: "polyextrude",
    label: "PolyExtrude",
    group: "SOP",
    color: "#59666f",
    params: [
      ["distance", "0.1"],
      ["output_back", "on"],
    ],
  },
  {
    type: "boolean",
    label: "Boolean",
    group: "SOP",
    color: "#59666f",
    params: [
      ["operation", "subtract"],
      ["resolve", "seams"],
    ],
  },
  {
    type: "remesh",
    label: "Remesh",
    group: "SOP",
    color: "#59666f",
    params: [
      ["target_size", "0.05"],
      ["iterations", "3"],
    ],
  },
  {
    type: "vdbfrompolygons",
    label: "VDB from Polygons",
    group: "SOP",
    color: "#4f7a84",
    params: [
      ["voxel_size", "0.03"],
      ["fill", "interior"],
    ],
  },
  {
    type: "merge",
    label: "Merge",
    group: "SOP",
    color: "#75808a",
    params: [["inputs", "multi"]],
  },
  {
    type: "null",
    label: "Null",
    group: "SOP",
    color: "#9ca3af",
    params: [["display", "OUT"]],
  },
  {
    type: "blast",
    label: "Blast",
    group: "SOP",
    color: "#7c8a96",
    params: [
      ["group", "@name=proxy"],
      ["delete", "selected"],
    ],
  },
  {
    type: "copytopoints",
    label: "Copy to Points",
    group: "SOP",
    color: "#487e91",
    params: [
      ["targetpoints", "1"],
      ["pack", "on"],
    ],
  },
  {
    type: "switch",
    label: "Switch",
    group: "SOP",
    color: "#75808a",
    params: [["input", "0"]],
  },
  {
    type: "rbdpackedobject",
    label: "RBD Packed Object",
    group: "DOP",
    color: "#7c3aed",
    params: [
      ["creationframe", "1"],
      ["active", "1"],
    ],
  },
  {
    type: "bulletrbdsolver",
    label: "Bullet Solver",
    group: "DOP",
    color: "#7c3aed",
    params: [
      ["substeps", "1"],
      ["constraint_iter", "10"],
    ],
  },
  {
    type: "gravity",
    label: "Gravity",
    group: "DOP",
    color: "#7c3aed",
    params: [["force", "0, -9.8, 0"]],
  },
  {
    type: "pyrosolver",
    label: "Pyro Solver",
    group: "DOP",
    color: "#7c3aed",
    params: [
      ["substeps", "2"],
      ["voxel_size", "0.08"],
    ],
  },
  {
    type: "vellumsolver",
    label: "Vellum Solver",
    group: "DOP",
    color: "#7c3aed",
    params: [
      ["substeps", "5"],
      ["constraint_iter", "100"],
    ],
  },
  {
    type: "popsolver",
    label: "POP Solver",
    group: "DOP",
    color: "#7c3aed",
    params: [
      ["birth", "stream"],
      ["forcescale", "1"],
    ],
  },
  {
    type: "vopnet",
    label: "VOP Network",
    group: "VOP",
    color: "#14b8a6",
    params: [
      ["context", "surface"],
      ["compile", "vex"],
    ],
  },
  {
    type: "bind",
    label: "Bind",
    group: "VOP",
    color: "#14b8a6",
    params: [
      ["name", "Cd"],
      ["type", "vector"],
    ],
  },
  {
    type: "fitrange",
    label: "Fit Range",
    group: "VOP",
    color: "#14b8a6",
    params: [
      ["srcmin", "0"],
      ["srcmax", "1"],
    ],
  },
  {
    type: "sopcreate",
    label: "SOP Create",
    group: "LOP",
    color: "#b9822c",
    params: [
      ["primpath", "/World/geo/$OS"],
      ["layer", "active"],
    ],
  },
  {
    type: "sopimport",
    label: "SOP Import",
    group: "LOP",
    color: "#b9822c",
    params: [
      ["soppath", "/obj/geo1/OUT"],
      ["pathprefix", "/World"],
    ],
  },
  {
    type: "assignmaterial",
    label: "Assign Material",
    group: "LOP",
    color: "#b9822c",
    params: [
      ["primpattern", "/World/geo/*"],
      ["material", "/materials/mat"],
    ],
  },
  {
    type: "assetreference",
    label: "Asset Reference",
    group: "LOP",
    color: "#b9822c",
    params: [
      ["assetpath", "$HIP/assets/asset.usd"],
      ["primpath", "/World/asset"],
    ],
  },
  {
    type: "karma",
    label: "Karma Render",
    group: "ROP",
    color: "#d13f34",
    params: [
      ["engine", "XPU"],
      ["samples", "128"],
    ],
  },
  {
    type: "usdrender",
    label: "USD Render",
    group: "ROP",
    color: "#d13f34",
    params: [
      ["renderer", "karma"],
      ["output", "$HIP/render/$OS.$F4.exr"],
    ],
  },
  {
    type: "geometryrop",
    label: "Geometry ROP",
    group: "ROP",
    color: "#d13f34",
    params: [
      ["soppath", "/obj/geo1/OUT"],
      ["output", "$HIP/geo/$OS.bgeo.sc"],
    ],
  },
  {
    type: "materiallibrary",
    label: "Material Library",
    group: "LOP",
    color: "#b9822c",
    params: [
      ["path", "/materials"],
      ["assign", "on"],
    ],
  },
  {
    type: "channel",
    label: "Channel",
    group: "CHOP",
    color: "#06b6d4",
    params: [
      ["channels", "tx ty tz"],
      ["rate", "24"],
    ],
  },
  {
    type: "math",
    label: "Math",
    group: "CHOP",
    color: "#06b6d4",
    params: [
      ["combine", "add"],
      ["scope", "*"],
    ],
  },
  {
    type: "lag",
    label: "Lag",
    group: "CHOP",
    color: "#06b6d4",
    params: [
      ["lag", "0.2"],
      ["overshoot", "0"],
    ],
  },
  {
    type: "copfile",
    label: "File COP",
    group: "COP",
    color: "#ec4899",
    params: [
      ["filename", "$HIP/textures/source.exr"],
      ["colorspace", "linear"],
    ],
  },
  {
    type: "colorcorrect",
    label: "Color Correct",
    group: "COP",
    color: "#ec4899",
    params: [
      ["gamma", "1"],
      ["saturation", "1"],
    ],
  },
  {
    type: "blur",
    label: "Blur",
    group: "COP",
    color: "#ec4899",
    params: [
      ["size", "4"],
      ["filter", "gaussian"],
    ],
  },
  {
    type: "filepattern",
    label: "File Pattern",
    group: "TOP",
    color: "#22c55e",
    params: [
      ["pattern", "$HIP/geo/*.bgeo.sc"],
      ["split", "files"],
    ],
  },
  {
    type: "ropgeometry",
    label: "ROP Geometry Output",
    group: "TOP",
    color: "#22c55e",
    params: [
      ["soppath", "/obj/geo1/OUT"],
      ["cooktype", "in-process"],
    ],
  },
  {
    type: "wedge",
    label: "Wedge",
    group: "TOP",
    color: "#22c55e",
    params: [
      ["wedgetype", "range"],
      ["wedgecount", "8"],
    ],
  },
  {
    type: "apexgraph",
    label: "APEX Graph",
    group: "APEX",
    color: "#f97316",
    params: [
      ["rig", "character"],
      ["evaluation", "graph"],
    ],
  },
  {
    type: "rigpose",
    label: "Rig Pose",
    group: "APEX",
    color: "#f97316",
    params: [
      ["skeleton", "input"],
      ["pose", "editable"],
    ],
  },
];

const HOU_NODE_INDEX = {
  OBJ: [
    "Ambient Light", "Area Light", "Blend", "Bones From Curve", "Camera", "Character Blend Shapes", "Distant Light", "Environment Light",
    "Fetch", "Force", "Geometry", "Geometry Light", "GI Light", "Houdini Field", "Instance", "Light", "Muscle", "Null", "Path", "Point Light",
    "Rivet", "Skeleton", "Sticky", "Subnet", "Switch", "Volume Light",
  ],
  SOP: [
    "Add", "Agent", "Agent Clip", "Agent Constraint Network", "Agent Layer", "Agent Look At", "Agent Prep", "Agent Relationship", "Agent Terrain Adaptation",
    "Alembic", "Align", "Attribute Adjust Color", "Attribute Adjust Float", "Attribute Adjust Integer", "Attribute Adjust Vector", "Attribute Blur",
    "Attribute Composite", "Attribute Copy", "Attribute Create", "Attribute Delete", "Attribute Expression", "Attribute Fill", "Attribute From Map",
    "Attribute Interpolate", "Attribute Noise", "Attribute Paint", "Attribute Promote", "Attribute Randomize", "Attribute Rename", "Attribute Reorient",
    "Attribute String Edit", "Attribute Swap", "Attribute Transfer", "Attribute VOP", "Attribute Wrangle", "Blast", "Blend Shapes", "Bone Capture",
    "Boolean", "Bound", "Box", "Brush Hair", "Cache", "Carve", "Circle", "Clean", "Clip", "Color", "Connectivity", "Convert", "Convert Line",
    "Convert Meta", "Convert VDB", "Copy And Transform", "Copy Stamp", "Copy To Points", "Curve", "Curve From Edges", "Curve SOP", "Curve To Mesh",
    "Delete", "Dissolve", "Divide", "Enumerate", "Ends", "Extrude Volume", "Facet", "File", "File Cache", "Find Shortest Path", "Flatten",
    "Fluid Compress", "Font", "Fuse", "Grid", "Group", "Group Combine", "Group Copy", "Group Create", "Group Delete", "Group Expression",
    "Group Promote", "Group Rename", "Group Transfer", "HeightField", "HeightField Blur", "HeightField Clip", "HeightField Copy Layer",
    "HeightField Distort", "HeightField Erode", "HeightField File", "HeightField Flow Field", "HeightField Layer", "HeightField Mask By Feature",
    "HeightField Mask By Object", "HeightField Mask Noise", "HeightField Noise", "HeightField Output", "HeightField Paint", "HeightField Project",
    "HeightField Remap", "Hole", "IsoOffset", "Join", "Labs Maps Baker", "Labs Quick Material", "Lattice", "Line", "Match Size", "Measure",
    "Merge", "Mountain", "Name", "Normal", "Null", "Object Merge", "Ocean Evaluate", "Ocean Spectrum", "Pack", "Partition", "Peak", "PolyBevel",
    "PolyBridge", "PolyCap", "PolyDoctor", "PolyDraw", "PolyExpand2D", "PolyExtrude", "PolyFill", "PolyFrame", "PolyPath", "PolyReduce",
    "PolySplit", "PolyWire", "Primitive", "Primitive Properties", "Ray", "Remesh", "Resample", "Reverse", "Scatter", "Scatter And Align",
    "Skin", "Smooth", "Sort", "Sphere", "Split", "Stash", "Subdivide", "Subnet", "Sweep", "Switch", "Test Geometry Crag", "Test Geometry Pig Head",
    "Test Geometry Rubber Toy", "Test Geometry Shader Ball", "Timeshift", "TopoBuild", "Trace", "Transform", "Transform Pieces", "Triangulate2D",
    "Tube", "UV Flatten", "UV Layout", "UV Project", "UV Quick Shade", "UV Transform", "UV Unwrap", "VDB", "VDB Activate", "VDB Analysis",
    "VDB Combine", "VDB Convert", "VDB From Particles", "VDB From Polygons", "VDB Morph", "VDB Reshape", "VDB Smooth", "VDB Vector Merge",
    "VDB Vector Split", "Volume", "Volume Blur", "Volume Compress", "Volume Mix", "Volume Rasterize Attributes", "Volume Rasterize Particles",
    "Volume VOP", "Volume Wrangle", "Voronoi Fracture", "Wireframe",
  ],
  DOP: [
    "Active Value", "Affector", "Apply Data", "AutoDOPNetwork", "Blend Solver", "Bullet Data", "Bullet Solver", "Cloth Object", "Cloth Solver",
    "Constraint Network", "Empty Object", "Flip Object", "Flip Solver", "Fluid Source", "Gas Advect", "Gas Analysis", "Gas Blur", "Gas Calculate",
    "Gas Combustion", "Gas Disturb", "Gas Enforce Boundary", "Gas Equalize Volume", "Gas Field VOP", "Gas Match Field", "Gas Particle To Field",
    "Gas Project Non Divergent", "Gas Resize Fluid Dynamic", "Gas Rest", "Gas Shred", "Gas Turbulence", "Gas Vortex Confinement", "Gravity",
    "Ground Plane", "POP Advect By Volumes", "POP Attract", "POP Axis Force", "POP Collision Detect", "POP Curve Force", "POP Drag", "POP Force",
    "POP Group", "POP Interact", "POP Kill", "POP Location", "POP Object", "POP Property", "POP Replicate", "POP Solver", "POP Source", "POP Spin",
    "Pyro Solver", "RBD Bullet Solver", "RBD Constraint Properties", "RBD Packed Object", "RBD Object", "Rigid Body Solver", "SOP Geometry",
    "SOP Solver", "Static Object", "Static Solver", "Vellum Constraint Properties", "Vellum Object", "Vellum Solver", "Wire Object", "Wire Solver",
  ],
  VOP: [
    "Add", "Anti Aliased Noise", "Attribute Bind", "Attribute VOP", "Bind", "Bind Export", "Clamp", "Compare", "Complement", "Constant",
    "Cross Product", "Curl Noise", "Displace Along Normal", "Distance", "Divide", "Dot Product", "Fit Range", "Float To Vector", "For Loop",
    "Get Attribute", "If Then Block", "Import Attribute", "Length", "Lerp", "Multiply", "Normalize", "Parameter", "Power", "Ramp Parameter",
    "Random", "Relative Bounding Box", "Rest Position", "Set Attribute", "Sine", "Subtract", "Switch", "Turbulent Noise", "Unified Noise",
    "Vector To Float", "Volume Sample", "VOP Network", "While Loop",
  ],
  LOP: [
    "Add Variant", "Assign Material", "Asset Reference", "Camera", "Configure Layer", "Configure Primitive", "Edit Material Network", "Edit Properties",
    "Edit Prototype", "Edit Render Properties", "Edit Variant", "Extract Instances", "Flatten Layer", "Graft Branches", "Instancer", "Karma", "Layer Break",
    "Layer Save", "Light Mixer", "Light", "Material Library", "Merge", "Merge Point Instancer", "Modify Point Instances", "Name Primitive", "Payload",
    "Prune", "Reference", "Render Gallery Source", "Render Product", "Render Settings", "Scene Add", "Scene Import", "Set Variant", "SOP Create",
    "SOP Import", "Stage Manager", "Sublayer", "Switch", "Transform", "USD Render ROP", "Volume LOP",
  ],
  ROP: [
    "Alembic", "Bake Texture", "Composite", "Fetch", "File Cache", "Geometry", "GLTF", "Karma", "OpenGL", "Redshift", "RenderMan", "ROP Alembic Output",
    "ROP Composite Output", "ROP FBX Character Output", "ROP Geometry Output", "ROP Network", "ROP USD Output", "Shell", "USD Render", "Wedge",
  ],
  CHOP: [
    "Area", "Audio In", "Band EQ", "Beat", "Blend", "Channel", "Composite", "Constant", "Copy", "Count", "Delay", "Delete", "Export", "Expression",
    "Fetch", "File", "Filter", "Geometry", "Hold", "Lag", "Limit", "Logic", "Lookup", "Math", "Merge", "Mouse", "Noise", "Object", "Pattern",
    "Pitch", "Rename", "Resample", "Shift", "Slope", "Spring", "Stretch", "Switch", "Trim", "Wave",
  ],
  COP: [
    "Add", "Blur", "Border", "Brightness", "Channel Copy", "Color", "Color Correct", "Color Curve", "Color Map", "Composite", "Constant", "Crop",
    "Defocus", "Depth Of Field", "Dilate Erode", "File", "Flip", "Font", "Gamma", "HSV", "Layer", "Levels", "Lookup", "Lumakey", "Mask", "Matte",
    "Merge", "Mosaic", "Noise", "Normal Map", "Over", "Premultiply", "Ramp", "Reformat", "Render", "Resize", "Roto", "Scale", "Shadow Matte",
    "Sharpen", "Switch", "Text", "Tile", "Transform", "VOP COP2 Generator", "VOP COP2 Filter", "White Balance",
  ],
  TOP: [
    "Attribute Create", "Attribute Copy", "Attribute Delete", "Attribute Rename", "Command Chain", "Command Server", "Deadline Scheduler", "Fetch",
    "File Compress", "File Copy", "File Delete", "File Pattern", "Filter By Expression", "Generic Generator", "Geometry Import", "HQueue Scheduler",
    "Invoke", "JSON Input", "Local Scheduler", "Map By Expression", "Merge", "Partition By Attribute", "Partition By Bounds", "Partition By Frame",
    "Python Processor", "ROP Fetch", "ROP Geometry Output", "Scheduler", "Sort", "SQL Input", "Switch", "Wait For All", "Wedge", "Work Item Expand",
  ],
  APEX: [
    "APEX Add Point", "APEX Autorig Component", "APEX Configure Controls", "APEX Control Extract", "APEX Edit Graph", "APEX Graph", "APEX Invoke Graph",
    "APEX Rigscript Component", "APEX Scene Animate", "APEX Scene Character Import", "APEX Scene Invoke", "APEX Script", "Bone Deform", "Full Body IK",
    "Joint Capture Biharmonic", "Rig Doctor", "Rig Pose", "Rig Stash Pose", "Skeleton Blend", "Skeleton Mirror", "Skeleton SOP", "Transform Joints",
  ],
};

const NODE_LIBRARY = buildHoudiniNodeLibrary();

const DEFAULT_STATE = {
  layout: "vertical",
  boardFolders: [],
  activeBoardId: "board-main",
  boards: [
    {
      id: "board-main",
      name: tr("缓存到渲染输出", "Cache to Render Output"),
      color: "#ff4f24",
      nodes: [
        {
          id: "n-geo",
          name: "geo1",
          type: "geo",
          group: "OBJ",
          x: 430,
          y: 90,
          color: "#59666f",
          note: tr("Geometry 容器入口，保持 display flag 清晰。", "Geometry container entry. Keep display flags easy to read."),
          params: [
            ["object_merge", "off"],
            ["scale", "1"],
          ],
        },
        {
          id: "n-file",
          name: "file_cache_in",
          type: "file",
          group: "SOP",
          x: 430,
          y: 255,
          color: "#3b6f9e",
          note: tr("缓存路径用 $HIP 相对路径，方便项目迁移。", "Use $HIP relative cache paths so projects stay portable."),
          params: [
            ["file", "$HIP/geo/asset_body.bgeo.sc"],
            ["missingframe", "error"],
          ],
        },
        {
          id: "n-wrangle",
          name: "attribwrangle_color_id",
          type: "attribwrangle",
          group: "SOP",
          x: 430,
          y: 420,
          color: "#c2572a",
          note: tr("按 name 写入稳定 id，后面 copy 和材质绑定都会用到。", "Write stable ids from name for later copy and material binding."),
          params: [
            ["runover", "Primitives"],
            ["snippet", "i@id = findattribval(0, 'prim', 'name', s@name);"],
          ],
        },
        {
          id: "n-mountain",
          name: "mountain_micro_noise",
          type: "mountain",
          group: "SOP",
          x: 430,
          y: 585,
          color: "#59666f",
          note: tr("只用于 viewport preview，最终缓存前可 bypass。", "Viewport preview only. Bypass before final cache if needed."),
          params: [
            ["height", "0.12"],
            ["element_size", "0.75"],
          ],
        },
        {
          id: "n-null",
          name: "OUT_RENDER",
          type: "null",
          group: "SOP",
          x: 430,
          y: 750,
          color: "#9ca3af",
          note: tr("下游引用这个稳定出口，不直接引用中间节点。", "Downstream networks should reference this stable output, not middle nodes."),
          params: [
            ["display", "on"],
            ["render", "on"],
          ],
        },
        {
          id: "n-karma",
          name: "karma_render1",
          type: "karma",
          group: "ROP",
          x: 730,
          y: 750,
          color: "#d13f34",
          note: tr("渲染输出记录放在同一画板，方便收藏整套连接方式。", "Keep render output on the same board to save the whole pattern."),
          params: [
            ["engine", "XPU"],
            ["samples", "128"],
          ],
        },
      ],
      connections: [
        { id: "c-1", from: "n-geo", to: "n-file" },
        { id: "c-2", from: "n-file", to: "n-wrangle" },
        { id: "c-3", from: "n-wrangle", to: "n-mountain" },
        { id: "c-4", from: "n-mountain", to: "n-null" },
        { id: "c-5", from: "n-null", to: "n-karma" },
      ],
    },
    {
      id: "board-fx",
      name: tr("Pyro 快速参考", "Pyro Quick Reference"),
      color: "#a855f7",
      nodes: [
        {
          id: "n-fx-source",
          name: "volume_rasterize_attributes",
          type: "volumerasterizeattributes",
          group: "SOP",
          x: 430,
          y: 140,
          color: "#4f7a84",
          note: tr("把点属性转成 density/temperature/source volume。", "Rasterize point attributes into density, temperature, and source volumes."),
          params: [["attributes", "density temperature v"]],
        },
        {
          id: "n-fx-solver",
          name: "pyrosolver_sparse",
          type: "pyrosolver",
          group: "DOP",
          x: 430,
          y: 310,
          color: "#7c3aed",
          note: tr("记录 substeps、voxel size 和 dissipation。", "Track substeps, voxel size, and dissipation."),
          params: [
            ["substeps", "2"],
            ["dissipation", "0.08"],
          ],
        },
        {
          id: "n-fx-cache",
          name: "filecache_sim",
          type: "filecache",
          group: "SOP",
          x: 430,
          y: 480,
          color: "#3b6f9e",
          note: tr("缓存模拟结果，后续 lookdev 只读盘。", "Cache the sim so lookdev can read from disk only."),
          params: [["file", "$HIP/geo/pyro.$F4.vdb"]],
        },
      ],
      connections: [
        { id: "c-fx-1", from: "n-fx-source", to: "n-fx-solver" },
        { id: "c-fx-2", from: "n-fx-solver", to: "n-fx-cache" },
      ],
    },
  ],
};

let state = loadState();
let selectedNodeId = state.nodes[0]?.id ?? null;
let selectedNodeIds = new Set(selectedNodeId ? [selectedNodeId] : []);
let selectedConnectionId = null;
let connectionSourceId = null;
let pendingWirePoint = null;
let portDragState = null;
let noteDragState = null;
let suppressPortClick = false;
let zoom = 1;
let viewPan = { x: 0, y: 0 };
let searchQuery = "";
let nodeMenuQuery = "";
let nodeMenuPosition = { x: 430, y: 255, screenX: 120, screenY: 120 };
let dragState = null;
let panState = null;
let marqueeState = null;
let cutMode = false;
let cutState = null;
let shakenNodeIds = new Set();
let currentImageFile = null;
let importCandidates = [];
let tesseractLoadPromise = null;
let cachedVisualCandidates = [];
let cachedOcrImage = "";
let cachedOcrText = "";
let serviceWorkspaceAvailable = false;
let serviceWorkspacePath = "";
let windowTopMostAvailable = false;
let windowTopMost = false;
let opfsWorkspaceAvailable = false;
let workspaceFileHandle = null;
let workspaceFileName = "";
let autosaveTimer = 0;
let autosaveInFlight = false;
let autosaveQueued = false;
let workspaceDirty = false;
let lastSavedAt = null;
let lastSaveError = "";
let saveReminderShown = false;
let nodeIndexStatus = null;
let octoClickCount = 0;
let octoClickTimer = 0;
let activeFolderId = "";
let lastSlashAt = 0;
let undoStack = [];
let redoStack = [];
let lastHistorySnapshot = "";
let isRestoringHistory = false;

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  void init();
});

async function init() {
  bindElements();
  bindEvents();
  if (!(await loadWorkspaceFromService())) {
    await loadWorkspaceFromOpfs();
  }
  void refreshWindowTopMostStatus();
  activeFolderId = getActiveBoard().folderId || "";
  resetHistory();
  renderAll();
  updateNodeIndexMeta();
  requestAnimationFrame(() => {
    fitGraph(false);
  });
}

function bindElements() {
  [
    "workspaceMeta",
    "octoLogo",
    "globalSearch",
    "searchToggleBtn",
    "pinWindowBtn",
    "graphSearch",
    "boardList",
    "nodeMenu",
    "nodeSearchInput",
    "nodeMenuList",
    "nodeMenuCount",
    "nodeMenuTitle",
    "nodeLayer",
    "boardNoteLayer",
    "wireLayer",
    "cutLayer",
    "selectionBox",
    "modeHint",
    "graphViewport",
    "graphWorld",
    "connectionHint",
    "activeCrumb",
    "graphTitle",
    "nodeIndexMeta",
    "zoomRange",
    "zoomValue",
    "addNodeBtn",
    "addBoardBtn",
    "addFolderBtn",
    "addBoardNoteBtn",
    "deleteBtn",
    "saveBtn",
    "exportBoardBtn",
    "importBoardBtn",
    "fitBtn",
    "refreshIndexBtn",
    "boardImportInput",
    "emptyInspector",
    "inspectorForm",
    "nodeNameInput",
    "nodeTypeInput",
    "nodeCategoryInput",
    "nodeInputCountInput",
    "nodeOutputCountInput",
    "nodeMultiInputInput",
    "nodeNoteInput",
    "nodeVexInput",
    "addNoteImageBtn",
    "noteImageInput",
    "noteImageList",
    "addParamBtn",
    "paramList",
    "screenshotBtn",
    "screenshotModal",
    "dropzone",
    "screenshotInput",
    "screenshotCanvas",
    "ocrText",
    "runOcrBtn",
    "applyImportBtn",
    "candidateList",
    "importStatus",
    "versionModal",
    "versionInfo",
    "imagePreviewModal",
    "imagePreviewImg",
    "imagePreviewCaption",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.globalSearch.addEventListener("input", () => {
    searchQuery = els.globalSearch.value.trim().toLowerCase();
    renderAll();
  });
  els.searchToggleBtn.addEventListener("click", toggleGraphSearch);
  els.pinWindowBtn.addEventListener("click", toggleWindowTopMost);

  els.addNodeBtn.addEventListener("click", () => openNodeMenuAtViewportCenter());
  els.addBoardBtn.addEventListener("click", addBoard);
  els.addFolderBtn.addEventListener("click", addBoardFolder);
  els.addBoardNoteBtn.addEventListener("click", () => addBoardNoteAtViewportCenter());
  els.octoLogo.addEventListener("click", handleOctoClick);
  els.saveBtn.addEventListener("click", saveWorkspaceNow);
  els.fitBtn.addEventListener("click", () => fitGraph(true));
  els.refreshIndexBtn.addEventListener("click", checkNodeIndexUpdates);
  els.deleteBtn.addEventListener("click", deleteSelection);
  els.exportBoardBtn.addEventListener("click", exportActiveBoard);
  els.importBoardBtn.addEventListener("click", openWorkspaceOrBoardFile);
  els.boardImportInput.addEventListener("change", importBoardJson);
  els.versionModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-version]")) closeVersionModal();
  });

  els.zoomRange.addEventListener("input", () => {
    zoomAtViewportCenter(Number(els.zoomRange.value) / 100);
  });
  els.graphViewport.addEventListener("wheel", handleWheelZoom, { passive: false });

  els.boardList.addEventListener("click", (event) => {
    const folderButton = event.target.closest("[data-folder-id]");
    if (folderButton) {
      const folder = state.boardFolders.find((item) => item.id === folderButton.dataset.folderId);
      if (!folder && folderButton.dataset.folderId) return;
      activeFolderId = folderButton.dataset.folderId || "";
      if (folder) folder.collapsed = !folder.collapsed;
      saveState();
      renderCategories();
      return;
    }
    const button = event.target.closest("[data-board-id]");
    if (!button) return;
    state.activeBoardId = button.dataset.boardId;
    activeFolderId = getActiveBoard().folderId || "";
    setSelectedNodes([getActiveBoard().nodes[0]?.id].filter(Boolean), { render: false });
    selectedConnectionId = null;
    closeNodeMenu();
    saveState();
    renderAll();
    fitGraph(false);
  });
  els.boardList.addEventListener("dblclick", (event) => {
    const button = event.target.closest("[data-board-id]");
    if (button) {
      renameBoard(button.dataset.boardId);
      return;
    }
    const folderButton = event.target.closest("[data-folder-id]");
    if (folderButton?.dataset.folderId) renameFolder(folderButton.dataset.folderId);
  });
  els.boardList.addEventListener("contextmenu", (event) => {
    const button = event.target.closest("[data-board-id]");
    if (!button) return;
    event.preventDefault();
    moveBoardToFolder(button.dataset.boardId);
  });

  els.nodeMenuList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind-type]");
    if (!button) return;
    const kind = NODE_LIBRARY.find((item) => item.type === button.dataset.kindType);
    addNodeFromKind(kind ?? NODE_LIBRARY[0], nodeMenuPosition);
    closeNodeMenu();
  });

  els.nodeSearchInput.addEventListener("input", () => {
    nodeMenuQuery = els.nodeSearchInput.value.trim().toLowerCase();
    renderPalette();
  });

  els.graphViewport.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    openNodeMenuAtScreenPoint(event.clientX, event.clientY);
  });
  els.graphViewport.addEventListener("pointerdown", handleCutPointerDown);
  els.graphViewport.addEventListener("mousedown", handleViewportMouseDown);
  window.addEventListener("mousemove", handleViewportMouseMove);
  window.addEventListener("mouseup", handleViewportMouseUp);
  els.graphViewport.addEventListener("pointerdown", handleMarqueePointerDown);

  els.nodeLayer.addEventListener("click", handleNodeLayerClick);
  els.nodeLayer.addEventListener("pointerdown", handlePortPointerDown);
  els.nodeLayer.addEventListener("pointerdown", handleNodePointerDown);
  els.boardNoteLayer.addEventListener("input", updateBoardNoteText);
  els.boardNoteLayer.addEventListener("click", handleBoardNoteLayerClick);
  els.boardNoteLayer.addEventListener("pointerdown", handleBoardNotePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointermove", handleBoardNotePointerMove);
  window.addEventListener("pointerup", handleBoardNotePointerUp);
  window.addEventListener("pointermove", handleConnectionPointerMove);
  window.addEventListener("pointerup", handlePortPointerUp);
  window.addEventListener("pointermove", handleMarqueePointerMove);
  window.addEventListener("pointerup", handleMarqueePointerUp);
  window.addEventListener("pointermove", handleCutPointerMove);
  window.addEventListener("pointerup", handleCutPointerUp);

  els.wireLayer.addEventListener("click", (event) => {
    const path = event.target.closest("[data-connection-id]");
    if (!path) return;
    closeNodeMenu();
    selectedConnectionId = path.dataset.connectionId;
    setSelectedNodes([], { render: false });
    renderConnections();
    renderInspector();
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !["input", "textarea", "select"].includes(tag)) {
      event.preventDefault();
      if (event.shiftKey) {
        redoLastChange();
      } else {
        undoLastChange();
      }
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y" && !["input", "textarea", "select"].includes(tag)) {
      event.preventDefault();
      redoLastChange();
      return;
    }
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !["input", "textarea", "select"].includes(tag)) {
      event.preventDefault();
      const now = performance.now();
      if (now - lastSlashAt < 520) {
        lastSlashAt = 0;
        addBoardNoteAtViewportCenter();
      } else {
        lastSlashAt = now;
      }
      return;
    }
    if (event.key === "Tab" && !["input", "textarea", "select"].includes(tag)) {
      event.preventDefault();
      openNodeMenuAtViewportCenter();
      return;
    }
    if (event.key.toLowerCase() === "y" && !["input", "textarea", "select"].includes(tag)) {
      event.preventDefault();
      setCutMode(true);
      return;
    }
    if (event.key === "Escape") {
      closeNodeMenu();
      closeGraphSearch();
      closeVersionModal();
      closeImagePreview();
      cancelConnection();
      selectedConnectionId = null;
      closeMarquee();
      renderConnections();
      return;
    }
    if (["input", "textarea", "select"].includes(tag)) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      deleteSelection();
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key.toLowerCase() === "y") {
      setCutMode(false);
    }
  });

  els.nodeNameInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeTypeInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeCategoryInput.addEventListener("change", updateSelectedNodeFromInspector);
  els.nodeInputCountInput.addEventListener("change", updateSelectedNodeFromInspector);
  els.nodeOutputCountInput.addEventListener("change", updateSelectedNodeFromInspector);
  els.nodeMultiInputInput.addEventListener("change", updateSelectedNodeFromInspector);
  els.nodeNoteInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeVexInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeNoteInput.addEventListener("paste", handleNoteImagePaste);
  els.nodeNoteInput.addEventListener("dragover", (event) => event.preventDefault());
  els.nodeNoteInput.addEventListener("drop", handleNoteImageDrop);
  els.addNoteImageBtn.addEventListener("click", () => els.noteImageInput.click());
  els.noteImageInput.addEventListener("change", handleNoteImageInput);
  els.noteImageList.addEventListener("click", handleNoteImageListClick);
  els.addParamBtn.addEventListener("click", addParam);
  els.paramList.addEventListener("input", updateParam);
  els.paramList.addEventListener("click", deleteParam);

  els.screenshotBtn.addEventListener("click", openScreenshotModal);
  els.screenshotModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) closeScreenshotModal();
  });
  els.imagePreviewModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-image-preview]")) closeImagePreview();
  });
  els.screenshotInput.addEventListener("change", () => {
    const file = els.screenshotInput.files?.[0];
    if (file) loadScreenshotFile(file);
  });
  els.dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.dropzone.classList.add("drag-over");
  });
  els.dropzone.addEventListener("dragleave", () => {
    els.dropzone.classList.remove("drag-over");
  });
  els.dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    els.dropzone.classList.remove("drag-over");
    const file = event.dataTransfer.files?.[0];
    if (file) loadScreenshotFile(file);
  });
  els.runOcrBtn.addEventListener("click", runScreenshotRecognition);
  els.ocrText.addEventListener("input", () => {
    importCandidates = buildCandidatesFromText(els.ocrText.value);
    renderCandidates();
  });
  els.applyImportBtn.addEventListener("click", applyScreenshotImport);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && workspaceDirty) {
      void flushAutosave();
    }
  });
  window.addEventListener("beforeunload", (event) => {
    if (!workspaceDirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
  window.addEventListener("error", handleRuntimeFailure);
  window.addEventListener("unhandledrejection", handleRuntimeFailure);
  window.setInterval(sendServicePing, 5000);
  document.addEventListener("paste", handleGlobalPaste);
}

function loadState() {
  return ensureStateAccessors(normalizeState(DEFAULT_STATE));
}

function normalizeState(input) {
  const next = cloneState(DEFAULT_STATE);
  if (!input || typeof input !== "object") return next;
  next.layout = "vertical";
  next.boardFolders = normalizeBoardFolders(input.boardFolders);
  if (Array.isArray(input.boards) && input.boards.length) {
    next.boards = input.boards.map((board, index) => normalizeBoard(board, index));
    next.activeBoardId = String(input.activeBoardId || next.boards[0].id);
  } else if (Array.isArray(input.nodes)) {
    next.boards = [
      normalizeBoard(
        {
          id: "board-imported",
          name: tr("旧版导入画板", "Legacy Imported Board"),
          color: "#ff4f24",
          nodes: input.nodes,
          connections: input.connections,
        },
        0,
      ),
    ];
    next.activeBoardId = "board-imported";
  }
  if (!next.boards.some((board) => board.id === next.activeBoardId)) {
    next.activeBoardId = next.boards[0].id;
  }
  const folderIds = new Set(next.boardFolders.map((folder) => folder.id));
  next.boards.forEach((board) => {
    if (board.folderId && !folderIds.has(board.folderId)) board.folderId = "";
  });
  return next;
}

function normalizeBoardFolders(folders) {
  if (!Array.isArray(folders)) return [];
  return folders
    .map((folder, index) => ({
      id: String(folder.id || makeId("folder")),
      name: String(folder.name || tr(`文件夹 ${index + 1}`, `Folder ${index + 1}`)),
      collapsed: Boolean(folder.collapsed),
    }))
    .filter((folder) => folder.name.trim())
    .slice(0, 48);
}

function normalizeBoard(board, index) {
  const nodeSource = Array.isArray(board.nodes) ? board.nodes : [];
  const nodes = nodeSource.map((node, nodeIndex) => normalizeNode(node, nodeIndex));
  const connections = Array.isArray(board.connections)
    ? board.connections
        .map((connection) => ({
          id: String(connection.id || makeId("c")),
          from: String(connection.from || ""),
          to: String(connection.to || ""),
          fromPort: clampInt(connection.fromPort ?? 0, 0, PORT_COUNT_MAX - 1),
          toPort: clampInt(connection.toPort ?? 0, 0, PORT_COUNT_MAX - 1),
        }))
        .filter((connection) => nodes.some((node) => node.id === connection.from) && nodes.some((node) => node.id === connection.to))
    : [];
  return {
    id: String(board.id || makeId("board")),
    name: String(board.name || tr(`画板 ${index + 1}`, `Board ${index + 1}`)),
    color: String(board.color || COLOR_POOL[index % COLOR_POOL.length]),
    folderId: String(board.folderId || ""),
    notes: normalizeBoardNotes(board.notes),
    nodes,
    connections,
  };
}

function normalizeBoardNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .map((note, index) => ({
      id: String(note.id || makeId("note")),
      text: String(note.text || ""),
      x: Number.isFinite(Number(note.x)) ? Number(note.x) : 180 + index * 34,
      y: Number.isFinite(Number(note.y)) ? Number(note.y) : 160 + index * 34,
      width: clampInt(note.width || BOARD_NOTE_WIDTH, 170, 380),
    }))
    .slice(0, 120);
}

function normalizeNode(node, index) {
  const type = String(node.type || "null");
  const categoryGroup = inferGroupFromCategory(node.category || "");
  const group = String(node.group || categoryGroup || groupForType(type) || "SOP");
  const defaults = defaultPortsForType(type);
  return {
    id: String(node.id || makeId("n")),
    name: String(node.name || `node_${index + 1}`),
    type,
    group,
    inputCount: clampInt(node.inputCount ?? defaults.inputCount, 0, PORT_COUNT_MAX),
    outputCount: clampInt(node.outputCount ?? defaults.outputCount, 0, PORT_COUNT_MAX),
    multiInput: Boolean(node.multiInput ?? defaults.multiInput),
    x: Number.isFinite(Number(node.x)) ? Number(node.x) : 120 + index * 32,
    y: Number.isFinite(Number(node.y)) ? Number(node.y) : 120 + index * 32,
    color: String(node.color || colorForType(type)),
    note: String(node.note || ""),
    vexpression: String(node.vexpression || node.vex || ""),
    noteImages: normalizeNoteImages(node.noteImages),
    params: Array.isArray(node.params)
      ? node.params.map((param) => [String(param[0] ?? ""), String(param[1] ?? "")])
      : [],
  };
}

function normalizeNoteImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image, index) => ({
      id: String(image.id || makeId("img")),
      name: String(image.name || `screenshot_${index + 1}`),
      dataUrl: String(image.dataUrl || ""),
      createdAt: String(image.createdAt || new Date().toISOString()),
    }))
    .filter((image) => image.dataUrl.startsWith("data:image/"))
    .slice(0, NOTE_IMAGE_MAX);
}

function ensureStateAccessors(target) {
  Object.defineProperty(target, "nodes", {
    configurable: true,
    enumerable: false,
    get() {
      return getActiveBoard(target).nodes;
    },
    set(value) {
      getActiveBoard(target).nodes = value;
    },
  });
  Object.defineProperty(target, "connections", {
    configurable: true,
    enumerable: false,
    get() {
      return getActiveBoard(target).connections;
    },
    set(value) {
      getActiveBoard(target).connections = value;
    },
  });
  return target;
}

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveState() {
  captureHistorySnapshot();
  workspaceDirty = true;
  updateMeta();
  scheduleAutosave();
}

function serializeHistoryState() {
  return JSON.stringify(snapshotState());
}

function resetHistory() {
  undoStack = [];
  redoStack = [];
  lastHistorySnapshot = serializeHistoryState();
}

function captureHistorySnapshot() {
  if (isRestoringHistory) return;
  const current = serializeHistoryState();
  if (!lastHistorySnapshot) {
    lastHistorySnapshot = current;
    return;
  }
  if (current === lastHistorySnapshot) return;
  undoStack.push(lastHistorySnapshot);
  if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
  redoStack = [];
  lastHistorySnapshot = current;
}

function undoLastChange() {
  if (!undoStack.length) {
    flashModeHint(tr("没有可撤回的操作", "Nothing to undo"));
    return;
  }
  const current = serializeHistoryState();
  const previous = undoStack.pop();
  redoStack.push(current);
  restoreHistorySnapshot(previous);
  flashModeHint(tr("已撤回", "Undone"));
}

function redoLastChange() {
  if (!redoStack.length) {
    flashModeHint(tr("没有可恢复的操作", "Nothing to redo"));
    return;
  }
  const current = serializeHistoryState();
  const next = redoStack.pop();
  undoStack.push(current);
  restoreHistorySnapshot(next);
  flashModeHint(tr("已恢复", "Redone"));
}

function restoreHistorySnapshot(snapshot) {
  isRestoringHistory = true;
  try {
    state = ensureStateAccessors(normalizeState(JSON.parse(snapshot)));
    activeFolderId = getActiveBoard().folderId || "";
    selectedConnectionId = null;
    connectionSourceId = null;
    pendingWirePoint = null;
    portDragState = null;
    noteDragState = null;
    setSelectedNodes([getActiveBoard().nodes[0]?.id].filter(Boolean), { render: false });
    lastHistorySnapshot = snapshot;
    workspaceDirty = true;
    renderAll();
    scheduleAutosave();
  } finally {
    isRestoringHistory = false;
  }
}

function snapshotState() {
  return cloneState({
    layout: "vertical",
    boardFolders: state.boardFolders,
    activeBoardId: state.activeBoardId,
    boards: state.boards,
  });
}

function serializeWorkspace() {
  return JSON.stringify(
    {
      schema: WORKSPACE_SCHEMA,
      appVersion: APP_VERSION,
      nodeIndexVersion: NODE_INDEX_VERSION,
      language: APP_LANG,
      savedAt: new Date().toISOString(),
      state: snapshotState(),
    },
    null,
    2,
  );
}

function supportsFileSystemAccess() {
  return Boolean(window.showSaveFilePicker && window.showOpenFilePicker);
}

async function loadWorkspaceFromService() {
  try {
    const response = await fetch(`/api/workspace?lang=${encodeURIComponent(APP_LANG)}`, { cache: "no-store" });
    if (!response.ok) return false;
    const result = await response.json();
    if (!result?.ok) return false;
    serviceWorkspaceAvailable = true;
    serviceWorkspacePath = result.path || "";
    workspaceFileName = result.fileName || tr("本地自动保存文件", "local autosave file");
    workspaceFileHandle = null;
    if (result.exists && result.workspace) {
      const payload = result.workspace;
      const payloadState = payload.state || payload;
      state = ensureStateAccessors(normalizeState(payloadState));
      activeFolderId = getActiveBoard().folderId || "";
      selectedConnectionId = null;
      connectionSourceId = null;
      setSelectedNodes([getActiveBoard().nodes[0]?.id].filter(Boolean), { render: false });
      lastSavedAt = result.savedAt ? new Date(result.savedAt) : payload.savedAt ? new Date(payload.savedAt) : null;
    }
    workspaceDirty = false;
    lastSaveError = "";
    return true;
  } catch {
    serviceWorkspaceAvailable = false;
    return false;
  }
}

function sendServicePing() {
  if (!serviceWorkspaceAvailable) return;
  fetch("/api/ping", { cache: "no-store" }).catch(() => {
    serviceWorkspaceAvailable = false;
    windowTopMostAvailable = false;
    windowTopMost = false;
    updatePinButton();
  });
}

async function refreshWindowTopMostStatus() {
  updatePinButton();
  if (!serviceWorkspaceAvailable) return;
  try {
    const response = await fetch("/api/window-topmost", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json();
    if (!result?.ok) return;
    windowTopMostAvailable = Boolean(result.available);
    windowTopMost = Boolean(result.topMost);
  } catch {
    windowTopMostAvailable = false;
  } finally {
    updatePinButton();
  }
}

async function toggleWindowTopMost() {
  if (!serviceWorkspaceAvailable) {
    flashModeHint(tr("置顶功能需要用 EXE 独立窗口启动", "Pin requires the standalone EXE window"));
    return;
  }
  const nextValue = windowTopMost ? "0" : "1";
  try {
    const response = await fetch(`/api/window-topmost?topMost=${nextValue}`, {
      method: "POST",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (!result?.ok || !result.available) throw new Error(result?.message || "window unavailable");
    windowTopMostAvailable = true;
    windowTopMost = Boolean(result.topMost);
    updatePinButton();
    flashModeHint(windowTopMost ? tr("窗口已置顶", "Window pinned on top") : tr("窗口已取消置顶", "Window unpinned"));
  } catch {
    windowTopMostAvailable = false;
    updatePinButton();
    flashModeHint(tr("没有找到可置顶的 Collins 窗口", "No Collins window was available to pin"));
  }
}

function updatePinButton() {
  if (!els.pinWindowBtn) return;
  els.pinWindowBtn.classList.toggle("active", windowTopMost);
  els.pinWindowBtn.classList.toggle("unavailable", serviceWorkspaceAvailable && !windowTopMostAvailable);
  els.pinWindowBtn.setAttribute("aria-pressed", windowTopMost ? "true" : "false");
  const title = windowTopMost
    ? tr("取消窗口置顶", "Unpin window")
    : serviceWorkspaceAvailable && !windowTopMostAvailable
      ? tr("置顶窗口（等待窗口句柄）", "Pin window (waiting for window handle)")
      : tr("窗口置顶", "Pin window on top");
  els.pinWindowBtn.title = title;
  els.pinWindowBtn.setAttribute("aria-label", title);
}

async function loadWorkspaceFromOpfs() {
  if (!navigator.storage?.getDirectory) return false;
  try {
    await navigator.storage.persist?.();
    const root = await navigator.storage.getDirectory();
    opfsWorkspaceAvailable = true;
    workspaceFileName = OPFS_WORKSPACE_FILE;
    try {
      const handle = await root.getFileHandle(OPFS_WORKSPACE_FILE);
      const file = await handle.getFile();
      const text = await file.text();
      if (text.trim()) {
        const payload = JSON.parse(text);
        const payloadState = payload.state || payload;
        state = ensureStateAccessors(normalizeState(payloadState));
        activeFolderId = getActiveBoard().folderId || "";
        selectedConnectionId = null;
        connectionSourceId = null;
        setSelectedNodes([getActiveBoard().nodes[0]?.id].filter(Boolean), { render: false });
        lastSavedAt = payload.savedAt ? new Date(payload.savedAt) : new Date(file.lastModified);
      }
    } catch (error) {
      if (error?.name !== "NotFoundError") throw error;
    }
    workspaceDirty = false;
    lastSaveError = "";
    return true;
  } catch {
    opfsWorkspaceAvailable = false;
    return false;
  }
}

async function saveWorkspaceNow() {
  try {
    if (serviceWorkspaceAvailable) {
      await flushAutosave({ force: true });
      flashMeta(tr("已无感保存到本地", "Saved silently to local storage"));
      return;
    }
    if (opfsWorkspaceAvailable) {
      await flushAutosave({ force: true });
      flashMeta(tr("网页本地保存完成", "Web local save complete"));
      return;
    }
    if (!supportsFileSystemAccess()) {
      downloadWorkspaceFile();
      workspaceDirty = false;
      lastSaveError = "";
      lastSavedAt = new Date();
      flashMeta(tr("已下载工作区 JSON", "Workspace JSON downloaded"));
      return;
    }
    if (!workspaceFileHandle) {
      workspaceFileHandle = await window.showSaveFilePicker({
        suggestedName: `houdini-node-atlas-workspace-${new Date().toISOString().slice(0, 10)}.json`,
        types: [
          {
            description: "Collins JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      workspaceFileName = workspaceFileHandle.name || tr("本地工作区文件", "local workspace file");
    }
    await flushAutosave({ force: true });
    flashMeta(tr("已保存到本地文件", "Saved to local file"));
  } catch (error) {
    if (error?.name === "AbortError") return;
    lastSaveError = error?.message || String(error);
    workspaceDirty = true;
    updateMeta();
    window.alert(tr("保存失败，请另存为新的 JSON 文件。", "Save failed. Please save to a new JSON file."));
  }
}

function scheduleAutosave() {
  if (!serviceWorkspaceAvailable && !opfsWorkspaceAvailable && !workspaceFileHandle) {
    showSaveReminder();
    return;
  }
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => {
    void flushAutosave();
  }, AUTOSAVE_DELAY);
}

function showSaveReminder() {
  if (saveReminderShown) return;
  saveReminderShown = true;
  window.setTimeout(() => {
    if (!serviceWorkspaceAvailable && !opfsWorkspaceAvailable && !workspaceFileHandle && workspaceDirty) {
      flashMeta(tr("当前浏览器不支持无感保存，请点击保存导出文件", "This browser cannot silently save; click Save to export"));
    }
  }, 120);
}

async function flushAutosave(options = {}) {
  if ((!serviceWorkspaceAvailable && !opfsWorkspaceAvailable && !workspaceFileHandle) || (!workspaceDirty && !options.force)) return;
  if (autosaveInFlight) {
    autosaveQueued = true;
    return;
  }
  autosaveInFlight = true;
  autosaveQueued = false;
  try {
    if (serviceWorkspaceAvailable) {
      await saveWorkspaceToService();
    } else if (opfsWorkspaceAvailable) {
      await saveWorkspaceToOpfs();
    } else {
      await ensureHandlePermission(workspaceFileHandle, "readwrite");
      const writable = await workspaceFileHandle.createWritable();
      await writable.write(serializeWorkspace());
      await writable.close();
      lastSavedAt = new Date();
    }
    workspaceDirty = false;
    lastSaveError = "";
  } catch (error) {
    lastSaveError = error?.message || String(error);
    workspaceDirty = true;
  } finally {
    autosaveInFlight = false;
    updateMeta();
  }
  if (autosaveQueued) {
    autosaveQueued = false;
    await flushAutosave({ force: true });
  }
}

async function saveWorkspaceToService() {
  const response = await fetch(`/api/workspace?lang=${encodeURIComponent(APP_LANG)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: serializeWorkspace(),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (!result?.ok) throw new Error(result?.message || "save failed");
  serviceWorkspacePath = result.path || serviceWorkspacePath;
  workspaceFileName = result.fileName || workspaceFileName || tr("本地自动保存文件", "local autosave file");
  lastSavedAt = result.savedAt ? new Date(result.savedAt) : new Date();
}

async function saveWorkspaceToOpfs() {
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle(OPFS_WORKSPACE_FILE, { create: true });
  const writable = await handle.createWritable();
  await writable.write(serializeWorkspace());
  await writable.close();
  workspaceFileName = OPFS_WORKSPACE_FILE;
  lastSavedAt = new Date();
}

async function ensureHandlePermission(handle, mode) {
  if (!handle?.queryPermission || !handle?.requestPermission) return true;
  const options = { mode };
  if ((await handle.queryPermission(options)) === "granted") return true;
  if ((await handle.requestPermission(options)) === "granted") return true;
  throw new Error(tr("没有本地文件写入权限", "No local file write permission"));
}

function downloadWorkspaceFile() {
  downloadJson(
    serializeWorkspace(),
    `houdini-node-atlas-workspace-${new Date().toISOString().slice(0, 10)}.json`,
  );
}

async function openWorkspaceOrBoardFile() {
  if (!supportsFileSystemAccess()) {
    els.boardImportInput.click();
    return;
  }
  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: "Collins JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    if (!handle) return;
    const file = await handle.getFile();
    await importJsonFile(file, handle);
  } catch (error) {
    if (error?.name !== "AbortError") {
      window.alert(tr("文件读取失败。", "File could not be read."));
    }
  }
}

async function importJsonFile(file, handle = null) {
  try {
    const parsed = JSON.parse(await file.text());
    if (isWorkspacePayload(parsed)) {
      const bindHandle = serviceWorkspaceAvailable || opfsWorkspaceAvailable ? null : handle;
      const payloadState = parsed.state || parsed;
      state = ensureStateAccessors(normalizeState(payloadState));
      activeFolderId = getActiveBoard().folderId || "";
      selectedConnectionId = null;
      connectionSourceId = null;
      setSelectedNodes([getActiveBoard().nodes[0]?.id].filter(Boolean), { render: false });
      workspaceFileHandle = bindHandle;
      workspaceFileName = serviceWorkspaceAvailable || opfsWorkspaceAvailable ? workspaceFileName || file.name : file.name || bindHandle?.name || "";
      workspaceDirty = serviceWorkspaceAvailable || opfsWorkspaceAvailable;
      lastSaveError = "";
      lastSavedAt = parsed.savedAt ? new Date(parsed.savedAt) : null;
      renderAll();
      fitGraph(false);
      resetHistory();
      if (serviceWorkspaceAvailable || opfsWorkspaceAvailable) {
        void flushAutosave({ force: true });
        flashMeta(tr("工作区已导入并同步到本地自动保存", "Workspace imported and synced to local autosave"));
      } else {
        flashMeta(bindHandle ? tr("工作区已打开，自动保存已启用", "Workspace opened; autosave enabled") : tr("工作区已读取", "Workspace loaded"));
      }
      return;
    }

    importBoardObject(parsed);
  } catch {
    window.alert(tr("JSON 文件无法识别。", "The JSON file could not be recognized."));
  }
}

function isWorkspacePayload(parsed) {
  if (!parsed || typeof parsed !== "object") return false;
  if (parsed.schema === WORKSPACE_SCHEMA && parsed.state) return true;
  return Array.isArray(parsed.boards) && (parsed.activeBoardId || parsed.layout);
}

function importBoardObject(parsed) {
  const source = Array.isArray(parsed.boards) ? parsed.boards[0] : parsed;
  const board = normalizeBoard(source, state.boards.length);
  board.id = makeId("board");
  if (board.folderId && !state.boardFolders.some((folder) => folder.id === board.folderId)) board.folderId = activeFolderId || "";
  if (state.boards.some((item) => item.name === board.name)) {
    board.name = `${board.name} copy`;
  }
  state.boards.push(board);
  state.activeBoardId = board.id;
  activeFolderId = board.folderId || "";
  setSelectedNodes([board.nodes[0]?.id].filter(Boolean), { render: false });
  selectedConnectionId = null;
  connectionSourceId = null;
  saveState();
  renderAll();
  fitGraph(false);
  flashMeta(tr("画板读取完成", "Board loaded"));
}

function downloadJson(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function handleOctoClick() {
  octoClickCount += 1;
  window.clearTimeout(octoClickTimer);
  octoClickTimer = window.setTimeout(() => {
    octoClickCount = 0;
  }, VERSION_CLICK_WINDOW);
  if (octoClickCount < VERSION_CLICK_TARGET) return;
  octoClickCount = 0;
  window.clearTimeout(octoClickTimer);
  openVersionModal();
}

function openVersionModal() {
  els.versionInfo.innerHTML = `
    <div><strong>${tr("版本", "Version")}</strong><br><code>v${APP_VERSION}</code></div>
    <div><strong>${tr("节点库", "Node index")}</strong><br><code>${NODE_INDEX_VERSION}</code></div>
    <div><strong>${tr("作者", "Author")}</strong><br>BlueShift Inc. and Muze OuYang</div>
    <div>${serviceWorkspaceAvailable ? tr("存储模式：EXE 本地服务无感自动保存。", "Storage: silent autosave through the local EXE service.") : opfsWorkspaceAvailable ? tr("存储模式：网页 OPFS 本地无感保存。", "Storage: silent web-local OPFS autosave.") : tr("存储模式：浏览器文件保存，需手动授权本地文件。", "Storage: browser file saving; local file permission is required.")}</div>
  `;
  els.versionModal.classList.remove("hidden");
}

function closeVersionModal() {
  els.versionModal.classList.add("hidden");
}

function openImagePreview(src, caption = "") {
  if (!src) return;
  els.imagePreviewImg.src = src;
  els.imagePreviewCaption.textContent = caption || tr("截图", "Screenshot");
  els.imagePreviewModal.classList.remove("hidden");
}

function closeImagePreview() {
  els.imagePreviewModal.classList.add("hidden");
  els.imagePreviewImg.removeAttribute("src");
}

function handleRuntimeFailure(event) {
  if (!workspaceDirty) return;
  lastSaveError = tr("运行时异常，已尝试保留未保存修改", "Runtime issue; unsaved changes were kept in memory");
  updateMeta();
  if (serviceWorkspaceAvailable || opfsWorkspaceAvailable || workspaceFileHandle) {
    void flushAutosave({ force: true });
  }
  if (event?.preventDefault) {
    event.preventDefault();
  }
}

function renderAll() {
  renderCategories();
  renderPalette();
  renderNodes();
  renderBoardNotes();
  renderConnections();
  renderInspector();
  updateMeta();
}

function renderCategories() {
  const boards = state.boards;
  const folders = [
    ...state.boardFolders,
    { id: "", name: tr("未分类", "Unfiled"), collapsed: false },
  ];
  els.boardList.innerHTML = folders
    .map((folder) => {
      const folderBoards = boards.filter((board) => (board.folderId || "") === folder.id);
      if (!folder.id && !folderBoards.length && state.boardFolders.length) return "";
      const collapsed = Boolean(folder.collapsed);
      const active = activeFolderId === folder.id;
      return `
        <section class="board-folder ${collapsed ? "collapsed" : ""}">
          <button class="folder-row ${active ? "active" : ""}" data-folder-id="${escapeHtml(folder.id)}" title="${tr("单击折叠，右键画板可移动到文件夹", "Click to collapse. Right-click a board to move it to a folder.")}">
            <svg><use href="#icon-folder"></use></svg>
            <span class="board-name">${escapeHtml(folder.name)}</span>
            <span class="folder-count">${folderBoards.length}</span>
          </button>
          <div class="folder-boards">
            ${folderBoards.map(renderBoardButton).join("") || `<div class="note-image-empty">${tr("空文件夹", "Empty folder")}</div>`}
          </div>
        </section>
      `;
    })
    .join("");

  const active = getActiveBoard();
  els.activeCrumb.textContent = active.folderId ? `${folderName(active.folderId)} / BOARD` : "BOARD";
  els.graphTitle.textContent = active.name;
}

function renderBoardButton(board) {
  return `
    <button class="board-item ${state.activeBoardId === board.id ? "active" : ""}" data-board-id="${escapeHtml(board.id)}" title="${tr("双击重命名，右键移动到文件夹", "Double-click to rename. Right-click to move to a folder.")}">
      <span class="board-swatch" style="background:${escapeHtml(board.color)}"></span>
      <span class="board-name">${escapeHtml(board.name)}</span>
      <span class="board-count">${board.nodes.length}</span>
    </button>
  `;
}

function folderName(folderId) {
  if (!folderId) return tr("未分类", "Unfiled");
  return state.boardFolders.find((folder) => folder.id === folderId)?.name || tr("文件夹", "Folder");
}

function renderPalette() {
  const visibleKinds = NODE_LIBRARY.filter((kind) => {
    if (!nodeMenuQuery) return true;
    return `${kind.label} ${kind.type} ${kind.group}`.toLowerCase().includes(nodeMenuQuery);
  });
  els.nodeMenuCount.textContent = `${visibleKinds.length}`;
  els.nodeMenuTitle.textContent = nodeMenuQuery ? "Search Results" : "All Houdini Contexts";
  els.nodeMenuList.innerHTML = visibleKinds
    .map(
      (kind) => `
        <button class="palette-item" data-kind-type="${escapeHtml(kind.type)}">
          <span class="palette-icon" style="background:${escapeHtml(kind.color)}">${nodeGlyph(kind.type)}</span>
          <span class="palette-meta">
            <strong class="palette-name">${escapeHtml(kind.label)}</strong>
            <span>${escapeHtml(kind.group)} · ${escapeHtml(kind.type)}</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderNodes() {
  const visibleNodes = state.nodes.filter(nodeIsVisible);
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  selectedNodeIds = new Set([...selectedNodeIds].filter((id) => visibleIds.has(id)));
  if (selectedNodeId && !selectedNodeIds.has(selectedNodeId)) {
    selectedNodeId = [...selectedNodeIds][0] ?? null;
  }

  els.nodeLayer.innerHTML = visibleNodes
    .map((node) => {
      const params = node.params.slice(0, 3);
      const paramHtml = params.length
        ? params
            .map(
              ([key, value]) => `
                <div class="node-param">
                  <span>${escapeHtml(key || "param")}</span>
                  <span>${escapeHtml(value || "-")}</span>
                </div>
              `,
            )
            .join("")
        : `<div class="node-param"><span>params</span><span>empty</span></div>`;
      return `
        <article class="node ${selectedNodeIds.has(node.id) ? "selected" : ""} ${selectedNodeIds.size > 1 && selectedNodeIds.has(node.id) ? "multi-selected" : ""}" data-node-id="${escapeHtml(node.id)}" style="--node-color:${escapeHtml(node.color)}; transform: translate(${node.x}px, ${node.y}px);">
          ${renderPorts(node, "input")}
          ${renderPorts(node, "output")}
          <div class="node-head">
            <span class="node-glyph">${nodeGlyph(node.type)}</span>
            <span class="node-title">${highlight(node.name)}</span>
            <span class="node-type">${escapeHtml(node.type)}</span>
          </div>
          <div class="node-body">${paramHtml}</div>
          ${renderNodeNote(node)}
        </article>
      `;
    })
    .join("");
}

function renderBoardNotes() {
  const notes = getActiveBoard().notes || [];
  els.boardNoteLayer.innerHTML = notes
    .map(
      (note) => `
        <article class="board-note-card" data-board-note-id="${escapeHtml(note.id)}" style="width:${clampInt(note.width || BOARD_NOTE_WIDTH, 170, 380)}px; transform: translate(${note.x}px, ${note.y}px);">
          <div class="board-note-head">
            <span class="board-note-title">${tr("画板便签", "Board note")}</span>
            <button type="button" class="small-icon danger" data-delete-board-note="${escapeHtml(note.id)}" title="${tr("删除便签", "Delete note")}" aria-label="${tr("删除便签", "Delete note")}">
              <svg><use href="#icon-trash"></use></svg>
            </button>
          </div>
          <textarea class="board-note-text" data-board-note-text="${escapeHtml(note.id)}" placeholder="${tr("写一点网络思路...", "Write a network note...")}">${escapeHtml(note.text)}</textarea>
        </article>
      `,
    )
    .join("");
}

function renderNodeNote(node) {
  const hasText = node.note.trim();
  const images = node.noteImages || [];
  if (!hasText && !images.length) return "";
  const imageHtml = images.length
    ? `<div class="node-note-images">${images.slice(0, 3).map((image) => `<button type="button" class="note-thumb-button" data-node-id="${escapeHtml(node.id)}" data-node-note-image-id="${escapeHtml(image.id)}" title="${escapeHtml(image.name)}"><img src="${escapeHtml(image.dataUrl)}" alt="${escapeHtml(image.name)}" /></button>`).join("")}</div>`
    : "";
  return `<aside class="node-note">${hasText ? `<div>${highlight(node.note)}</div>` : ""}${imageHtml}</aside>`;
}

function renderPorts(node, direction) {
  const count = direction === "input" ? node.inputCount : node.outputCount;
  if (!count) return "";
  const pendingClass = direction === "output" && connectionSourceId?.nodeId === node.id ? "pending" : "";
  return Array.from({ length: count }, (_, index) => {
    const position = portPositionPercent(index, count);
    const multiClass = direction === "input" && node.multiInput ? "multi" : "";
    const label = direction === "input" ? tr(`输入 ${index + 1}`, `Input ${index + 1}`) : tr(`输出 ${index + 1}`, `Output ${index + 1}`);
    return `<button class="port ${direction} ${pendingClass} ${multiClass}" style="--port-position:${position}%" data-node-id="${escapeHtml(node.id)}" data-port="${direction}" data-port-index="${index}" aria-label="${escapeHtml(node.name)} ${label}"></button>`;
  }).join("");
}

function renderConnections() {
  const visibleIds = new Set(state.nodes.filter(nodeIsVisible).map((node) => node.id));
  const html = state.connections
    .filter((connection) => visibleIds.has(connection.from) && visibleIds.has(connection.to))
    .map((connection) => {
      const from = getNode(connection.from);
      const to = getNode(connection.to);
      if (!from || !to) return "";
      const path = connectionPath(from, to, connection.fromPort ?? 0, connection.toPort ?? 0);
      const selected = selectedConnectionId === connection.id;
      return `
        <path class="wire ${selected ? "selected" : ""}" d="${path}"></path>
        <path class="wire-hit" d="${path}" data-connection-id="${escapeHtml(connection.id)}"></path>
      `;
    })
    .join("");
  const pendingHtml = renderPendingConnection();
  els.wireLayer.setAttribute("viewBox", `0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`);
  els.wireLayer.innerHTML = html + pendingHtml;
}

function renderPendingConnection() {
  if (!connectionSourceId || !pendingWirePoint) return "";
  const source = getNode(connectionSourceId.nodeId);
  if (!source) return "";
  const start = portWorldPoint(source, "output", connectionSourceId.portIndex);
  const end = {
    x: clamp(pendingWirePoint.x, 0, WORLD_WIDTH),
    y: clamp(pendingWirePoint.y, 0, WORLD_HEIGHT),
  };
  return `<path class="wire pending-wire" d="${connectionPathFromPoints(start, end)}"></path>`;
}

function renderViewportTransform() {
  els.graphWorld.style.transform = `translate(${viewPan.x}px, ${viewPan.y}px) scale(${zoom})`;
  const grid = 22 * zoom;
  els.graphViewport.style.backgroundSize = `${grid}px ${grid}px`;
  els.graphViewport.style.backgroundPosition = `${viewPan.x % grid}px ${viewPan.y % grid}px`;
}

function renderInspector() {
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  const singleNode = node && selectedNodeIds.size <= 1;
  els.emptyInspector.classList.toggle("hidden", Boolean(singleNode));
  els.inspectorForm.classList.toggle("hidden", !singleNode);

  if (!singleNode) {
    if (selectedConnectionId) {
      els.emptyInspector.innerHTML = tr("<strong>已选择连线</strong><span>可删除这条连接。</span>", "<strong>Wire selected</strong><span>You can delete this connection.</span>");
    } else if (selectedNodeIds.size > 1) {
      els.emptyInspector.innerHTML = tr(`<strong>已选择 ${selectedNodeIds.size} 个节点</strong><span>拖动其中一个节点可整体移动，Delete 删除所选。</span>`, `<strong>${selectedNodeIds.size} nodes selected</strong><span>Drag any selected node to move them together. Delete removes the selection.</span>`);
    } else {
      els.emptyInspector.innerHTML = tr("<strong>选择一个节点</strong><span>编辑网络类型、参数和旁注。</span>", "<strong>Select a node</strong><span>Edit context, parameters, and notes.</span>");
    }
    return;
  }

  els.nodeNameInput.value = node.name;
  els.nodeTypeInput.value = node.type;
  els.nodeNoteInput.value = node.note;
  els.nodeVexInput.value = node.vexpression || "";
  els.nodeCategoryInput.innerHTML = HOU_CONTEXTS
    .map((context) => `<option value="${escapeHtml(context.id)}">${escapeHtml(context.name)}</option>`)
    .join("");
  els.nodeCategoryInput.value = node.group;
  els.nodeInputCountInput.value = String(node.inputCount);
  els.nodeOutputCountInput.value = String(node.outputCount);
  els.nodeMultiInputInput.checked = Boolean(node.multiInput);
  renderNoteImages(node);
  renderParams(node);
}

function renderNoteImages(node) {
  const images = node.noteImages || [];
  if (!images.length) {
    els.noteImageList.innerHTML = `<div class="note-image-empty">${tr("可添加截图，或直接粘贴/拖入到 Note。", "Add screenshots, or paste/drop images into the Note field.")}</div>`;
    return;
  }
  els.noteImageList.innerHTML = images
    .map(
      (image) => `
        <figure class="note-image-item" data-note-image-id="${escapeHtml(image.id)}">
          <button type="button" class="note-thumb-button" data-preview-note-image="${escapeHtml(image.id)}" title="${tr("放大截图", "Open screenshot")}">
            <img src="${escapeHtml(image.dataUrl)}" alt="${escapeHtml(image.name)}" />
          </button>
          <figcaption title="${escapeHtml(image.name)}">${escapeHtml(image.name)}</figcaption>
          <button type="button" class="small-icon danger" data-delete-note-image="${escapeHtml(image.id)}" title="${tr("删除截图", "Delete screenshot")}" aria-label="${tr("删除截图", "Delete screenshot")}">
            <svg><use href="#icon-trash"></use></svg>
          </button>
        </figure>
      `,
    )
    .join("");
}

function renderParams(node) {
  els.paramList.innerHTML = node.params
    .map(
      ([key, value], index) => `
        <div class="param-row" data-param-index="${index}">
          <input data-param-field="key" value="${escapeHtml(key)}" aria-label="${tr("参数名", "Parameter name")}" />
          <input data-param-field="value" value="${escapeHtml(value)}" aria-label="${tr("参数值", "Parameter value")}" />
          <button type="button" class="small-icon danger" data-delete-param="${index}" title="${tr("删除参数", "Delete parameter")}" aria-label="${tr("删除参数", "Delete parameter")}">
            <svg><use href="#icon-trash"></use></svg>
          </button>
        </div>
      `,
    )
    .join("");
}

function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function updateMeta() {
  const board = getActiveBoard();
  const counts = IS_EN
    ? `${state.boards.length} boards · ${board.nodes.length} nodes · ${board.connections.length} wires`
    : `${state.boards.length} 个画板 · ${board.nodes.length} 个节点 · ${board.connections.length} 条连线`;
  let saveStatus = "";
  if (lastSaveError) {
    saveStatus = tr("本地保存失败", "local save failed");
  } else if (serviceWorkspaceAvailable && workspaceDirty) {
    saveStatus = tr("无感保存等待中", "silent autosave pending");
  } else if (serviceWorkspaceAvailable && lastSavedAt) {
    saveStatus = tr(`无感保存 ${formatTime(lastSavedAt)}`, `silent saved ${formatTime(lastSavedAt)}`);
  } else if (serviceWorkspaceAvailable) {
    saveStatus = tr("无感保存已就绪", "silent autosave ready");
  } else if (opfsWorkspaceAvailable && workspaceDirty) {
    saveStatus = tr("网页无感保存等待中", "web silent autosave pending");
  } else if (opfsWorkspaceAvailable && lastSavedAt) {
    saveStatus = tr(`网页已保存 ${formatTime(lastSavedAt)}`, `web saved ${formatTime(lastSavedAt)}`);
  } else if (opfsWorkspaceAvailable) {
    saveStatus = tr("网页无感保存已就绪", "web silent autosave ready");
  } else if (!workspaceFileHandle) {
    saveStatus = tr("未绑定本地文件", "no local file attached");
  } else if (workspaceDirty) {
    saveStatus = tr("自动保存等待中", "autosave pending");
  } else if (lastSavedAt) {
    saveStatus = tr(`已保存 ${formatTime(lastSavedAt)}`, `saved ${formatTime(lastSavedAt)}`);
  } else {
    saveStatus = tr("自动保存已就绪", "autosave ready");
  }
  const fileLabel = workspaceFileName ? ` · ${workspaceFileName}` : "";
  els.workspaceMeta.textContent = `${counts} · ${saveStatus}${fileLabel}`;
}

function updateNodeIndexMeta(status = loadNodeIndexStatus()) {
  const local = `v${APP_VERSION} · ${NODE_INDEX_VERSION} · ${NODE_LIBRARY.length} nodes`;
  if (!status?.checkedAt) {
    els.nodeIndexMeta.textContent = tr(`节点库 ${local} · 尚未检查 SideFX`, `Node index ${local} · SideFX not checked yet`);
    return;
  }
  const checked = new Date(status.checkedAt).toLocaleString();
  const remote = status.remoteCount ? `SideFX ${status.remoteCount} nodes` : tr("SideFX 未读取", "SideFX not read");
  const diff = Number.isFinite(status.delta) && status.delta !== 0 ? ` · ${tr("差异", "delta")} ${status.delta > 0 ? "+" : ""}${status.delta}` : "";
  const version = status.docsVersion ? ` · ${status.docsVersion}` : "";
  els.nodeIndexMeta.textContent = tr(`节点库 ${local} · ${remote}${diff}${version} · ${checked}`, `Node index ${local} · ${remote}${diff}${version} · ${checked}`);
}

function flashMeta(text) {
  const previous = els.workspaceMeta.textContent;
  els.workspaceMeta.textContent = text;
  window.setTimeout(() => {
    updateMeta();
  }, 900);
}

function flashModeHint(text) {
  els.modeHint.textContent = text;
  els.modeHint.classList.remove("hidden");
  window.clearTimeout(flashModeHint.timer);
  flashModeHint.timer = window.setTimeout(() => {
    if (!cutMode) els.modeHint.classList.add("hidden");
  }, 1200);
}

function loadNodeIndexStatus() {
  return nodeIndexStatus;
}

function saveNodeIndexStatus(status) {
  nodeIndexStatus = status;
  updateNodeIndexMeta(status);
}

async function checkNodeIndexUpdates() {
  els.refreshIndexBtn.disabled = true;
  els.nodeIndexMeta.textContent = tr(`节点库 v${APP_VERSION} · 正在检查 SideFX...`, `Node index v${APP_VERSION} · checking SideFX...`);
  try {
    const response = await fetch(`/api/node-index-check?localCount=${NODE_LIBRARY.length}&indexVersion=${encodeURIComponent(NODE_INDEX_VERSION)}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const status = {
      checkedAt: result.checkedAt || new Date().toISOString(),
      remoteCount: Number(result.remoteCount) || 0,
      localCount: NODE_LIBRARY.length,
      delta: (Number(result.remoteCount) || 0) - NODE_LIBRARY.length,
      docsVersion: result.docsVersion || "",
      source: result.source || "SideFX",
      ok: Boolean(result.ok),
      message: result.message || "",
    };
    saveNodeIndexStatus(status);
    flashModeHint(status.delta > 0 ? tr(`SideFX 可能新增 ${status.delta} 个节点`, `SideFX may have ${status.delta} new nodes`) : tr("节点库检查完成", "Node index check complete"));
  } catch (error) {
    const status = {
      checkedAt: new Date().toISOString(),
      remoteCount: 0,
      localCount: NODE_LIBRARY.length,
      delta: 0,
      docsVersion: "",
      source: "SideFX",
      ok: false,
      message: tr("需要通过 EXE 本地服务联网检查", "Use the local EXE server to check online"),
    };
    saveNodeIndexStatus(status);
    flashModeHint(tr("节点库检查失败，请用 EXE 启动后再试", "Node index check failed. Launch with the EXE and try again."));
  } finally {
    els.refreshIndexBtn.disabled = false;
  }
}

function nodeIsVisible(node) {
  if (!searchQuery) return true;
  const haystack = [
    node.name,
    node.type,
    node.group,
    node.note,
    node.vexpression,
    ...(node.noteImages || []).map((image) => image.name),
    ...node.params.flat(),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(searchQuery);
}

function highlight(text) {
  const safe = escapeHtml(text);
  if (!searchQuery || !text.toLowerCase().includes(searchQuery)) return safe;
  const index = text.toLowerCase().indexOf(searchQuery);
  const before = escapeHtml(text.slice(0, index));
  const match = escapeHtml(text.slice(index, index + searchQuery.length));
  const after = escapeHtml(text.slice(index + searchQuery.length));
  return `${before}<mark>${match}</mark>${after}`;
}

function handleNodeLayerClick(event) {
  if (suppressPortClick) {
    suppressPortClick = false;
    return;
  }
  const imageButton = event.target.closest("[data-node-note-image-id]");
  if (imageButton) {
    event.preventDefault();
    event.stopPropagation();
    const node = getNode(imageButton.dataset.nodeId);
    const image = (node?.noteImages || []).find((item) => item.id === imageButton.dataset.nodeNoteImageId);
    if (image) openImagePreview(image.dataUrl, image.name);
    return;
  }
  closeNodeMenu();
  const port = event.target.closest(".port");
  if (port) {
    handlePortClick(port, event);
    return;
  }
  if (connectionSourceId) {
    const snap = findNearestPortFromClient(event.clientX, event.clientY, "input");
    if (snap && snap.nodeId !== connectionSourceId.nodeId) {
      completeConnection(snap.nodeId, snap.portIndex);
      return;
    }
  }
  const nodeEl = event.target.closest(".node");
  if (!nodeEl) return;
  selectNode(nodeEl.dataset.nodeId);
}

function handlePortClick(port, event = null) {
  const nodeId = port.dataset.nodeId;
  const portIndex = Number(port.dataset.portIndex || 0);
  if (port.dataset.port === "output") {
    beginConnection(nodeId, portIndex, event);
    return;
  }

  completeConnection(nodeId, portIndex);
}

function beginConnection(nodeId, portIndex, event = null) {
  connectionSourceId = { nodeId, portIndex };
  const source = getNode(nodeId);
  const point = event ? viewportPointFromClient(event.clientX, event.clientY) : null;
  pendingWirePoint = point
    ? { x: point.worldX, y: point.worldY }
    : source
    ? portWorldPoint(source, "output", portIndex)
    : null;
  setSelectedNodes([nodeId], { render: false });
  selectedConnectionId = null;
  els.connectionHint.classList.add("visible");
  renderNodes();
  renderConnections();
  renderInspector();
}

function completeConnection(nodeId, portIndex) {
  if (!connectionSourceId || connectionSourceId.nodeId === nodeId) return false;
  const target = getNode(nodeId);
  const source = getNode(connectionSourceId.nodeId);
  if (!target || !source) return false;
  if (!target?.multiInput) {
    state.connections = state.connections.filter((connection) => !(connection.to === nodeId && (connection.toPort ?? 0) === portIndex));
  }
  const exists = state.connections.some(
    (connection) =>
      connection.from === connectionSourceId.nodeId &&
      connection.to === nodeId &&
      (connection.fromPort ?? 0) === connectionSourceId.portIndex &&
      (connection.toPort ?? 0) === portIndex,
  );
  if (!exists) {
    state.connections.push({
      id: makeId("c"),
      from: connectionSourceId.nodeId,
      to: nodeId,
      fromPort: connectionSourceId.portIndex,
      toPort: portIndex,
    });
  }
  connectionSourceId = null;
  pendingWirePoint = null;
  setSelectedNodes([nodeId], { render: false });
  els.connectionHint.classList.remove("visible");
  saveState();
  renderAll();
  return true;
}

function cancelConnection() {
  if (!connectionSourceId && !pendingWirePoint) return;
  connectionSourceId = null;
  pendingWirePoint = null;
  portDragState = null;
  els.connectionHint.classList.remove("visible");
  renderNodes();
  renderConnections();
}

function handlePortPointerDown(event) {
  const port = event.target.closest(".port.output");
  if (!port || event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  const nodeId = port.dataset.nodeId;
  const portIndex = Number(port.dataset.portIndex || 0);
  beginConnection(nodeId, portIndex, event);
  portDragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    dragged: false,
  };
  port.setPointerCapture?.(event.pointerId);
}

function handleConnectionPointerMove(event) {
  if (!connectionSourceId) return;
  const point = viewportPointFromClient(event.clientX, event.clientY);
  const snap = findNearestPortFromClient(event.clientX, event.clientY, "input");
  if (snap && snap.nodeId !== connectionSourceId.nodeId) {
    pendingWirePoint = portWorldPoint(getNode(snap.nodeId), "input", snap.portIndex);
  } else {
    pendingWirePoint = { x: point.worldX, y: point.worldY };
  }
  if (portDragState && Math.hypot(event.clientX - portDragState.startX, event.clientY - portDragState.startY) > 4) {
    portDragState.dragged = true;
  }
  renderConnections();
}

function handlePortPointerUp(event) {
  if (!portDragState || portDragState.pointerId !== event.pointerId) return;
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".port.input");
  const snap = target
    ? { nodeId: target.dataset.nodeId, portIndex: Number(target.dataset.portIndex || 0) }
    : findNearestPortFromClient(event.clientX, event.clientY, "input");
  if (snap && snap.nodeId !== connectionSourceId?.nodeId) {
    completeConnection(snap.nodeId, snap.portIndex);
  } else if (portDragState.dragged) {
    flashModeHint(tr("拖到输入端口完成连线", "Drop on an input port to complete the wire"));
  }
  if (portDragState.dragged) suppressPortClick = true;
  portDragState = null;
}

function findNearestPortFromClient(clientX, clientY, direction) {
  let best = null;
  els.nodeLayer.querySelectorAll(`.port.${direction}`).forEach((port) => {
    const rect = port.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(clientX - centerX, clientY - centerY);
    if (distance > PORT_SNAP_RADIUS) return;
    if (!best || distance < best.distance) {
      best = {
        distance,
        nodeId: port.dataset.nodeId,
        portIndex: Number(port.dataset.portIndex || 0),
      };
    }
  });
  return best;
}

function handleNodePointerDown(event) {
  if (event.button !== 0 || event.target.closest(".port, .note-thumb-button")) return;
  const nodeEl = event.target.closest(".node");
  if (!nodeEl) return;
  const node = getNode(nodeEl.dataset.nodeId);
  if (!node) return;
  if (!selectedNodeIds.has(node.id) || event.shiftKey) {
    if (event.shiftKey && selectedNodeIds.has(node.id)) {
      const next = new Set(selectedNodeIds);
      next.delete(node.id);
      setSelectedNodes([...next], { render: true });
      return;
    } else if (event.shiftKey) {
      setSelectedNodes([...selectedNodeIds, node.id], { primaryId: node.id, render: false });
    } else {
      setSelectedNodes([node.id], { render: false });
    }
  } else {
    selectedNodeId = node.id;
  }
  selectedConnectionId = null;
  els.nodeLayer.querySelectorAll(".node").forEach((item) => {
    const isSelected = selectedNodeIds.has(item.dataset.nodeId);
    item.classList.toggle("selected", isSelected);
    item.classList.toggle("multi-selected", isSelected && selectedNodeIds.size > 1);
  });
  renderConnections();
  renderInspector();
  const draggedIds = selectedNodeIds.has(node.id) ? [...selectedNodeIds] : [node.id];
  dragState = {
    id: node.id,
    ids: draggedIds,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastMoveTime: performance.now(),
    shakeDirection: 0,
    shakeFlips: 0,
    shakeEnergy: 0,
    disconnectedByShake: false,
    originals: new Map(draggedIds.map((id) => {
      const item = getNode(id);
      return [id, { x: item.x, y: item.y }];
    })),
    nodeEl,
  };
  nodeEl.classList.add("dragging");
  nodeEl.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  if (!dragState) return;
  const dx = (event.clientX - dragState.startX) / zoom;
  const dy = (event.clientY - dragState.startY) / zoom;
  dragState.ids.forEach((id) => {
    const node = getNode(id);
    const original = dragState.originals.get(id);
    if (!node || !original) return;
    node.x = clamp(Math.round(original.x + dx), 20, WORLD_WIDTH - NODE_WIDTH - 220);
    node.y = clamp(Math.round(original.y + dy), 20, WORLD_HEIGHT - NODE_HEIGHT - 40);
    const element = els.nodeLayer.querySelector(`[data-node-id="${CSS.escape(id)}"]`);
    if (element) element.style.transform = `translate(${node.x}px, ${node.y}px)`;
  });
  detectShakeDisconnect(event, dx, dy);
  renderConnections();
}

function handlePointerUp() {
  if (!dragState) return;
  dragState.nodeEl.classList.remove("dragging");
  saveState();
  dragState = null;
}

function detectShakeDisconnect(event, dx, dy) {
  if (!dragState || dragState.disconnectedByShake) return;
  const deltaX = event.clientX - dragState.lastX;
  const direction = Math.sign(deltaX);
  if (Math.abs(deltaX) > 10 && direction && dragState.shakeDirection && direction !== dragState.shakeDirection) {
    dragState.shakeFlips += 1;
    dragState.shakeEnergy += Math.abs(deltaX);
  }
  if (direction) dragState.shakeDirection = direction;
  dragState.lastX = event.clientX;

  const totalMotion = Math.hypot(dx, dy);
  if (dragState.shakeFlips >= 4 && dragState.shakeEnergy > 90 && totalMotion < 260) {
    const removed = disconnectNodes(dragState.ids);
    if (removed) {
      dragState.disconnectedByShake = true;
      flashModeHint(tr(`晃动断开 ${removed} 条连线`, `Shook loose ${removed} wires`));
      renderConnections();
    }
  }
}

function handleMarqueePointerDown(event) {
  if (cutMode || event.button !== 0 || event.target.closest(".node, .port, .node-menu, .board-note-card, [data-connection-id]")) return;
  if (!els.graphViewport.contains(event.target)) return;
  event.preventDefault();
  closeNodeMenu();
  selectedConnectionId = null;
  const start = viewportPointFromClient(event.clientX, event.clientY);
  marqueeState = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startWorldX: start.worldX,
    startWorldY: start.worldY,
    additive: event.shiftKey,
    baseSelection: new Set(selectedNodeIds),
    moved: false,
  };
  els.graphViewport.setPointerCapture?.(event.pointerId);
  els.graphViewport.classList.add("selecting");
  updateMarquee(event.clientX, event.clientY);
}

function handleMarqueePointerMove(event) {
  if (!marqueeState) return;
  updateMarquee(event.clientX, event.clientY);
}

function handleMarqueePointerUp(event) {
  if (!marqueeState) return;
  updateMarquee(event.clientX, event.clientY);
  const selected = nodesInMarquee(event.clientX, event.clientY);
  const next = marqueeState.additive ? new Set([...marqueeState.baseSelection, ...selected]) : new Set(selected);
  setSelectedNodes([...next], { render: true });
  closeMarquee();
}

function updateMarquee(clientX, clientY) {
  if (!marqueeState) return;
  const rect = els.graphViewport.getBoundingClientRect();
  const left = Math.min(marqueeState.startClientX, clientX) - rect.left;
  const top = Math.min(marqueeState.startClientY, clientY) - rect.top;
  const width = Math.abs(clientX - marqueeState.startClientX);
  const height = Math.abs(clientY - marqueeState.startClientY);
  const crossing = clientX < marqueeState.startClientX;
  marqueeState.moved = marqueeState.moved || width > 3 || height > 3;
  els.selectionBox.classList.remove("hidden");
  els.selectionBox.classList.toggle("crossing", crossing);
  Object.assign(els.selectionBox.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  });
}

function nodesInMarquee(clientX, clientY) {
  if (!marqueeState?.moved) return [];
  const end = viewportPointFromClient(clientX, clientY);
  const box = {
    left: Math.min(marqueeState.startWorldX, end.worldX),
    right: Math.max(marqueeState.startWorldX, end.worldX),
    top: Math.min(marqueeState.startWorldY, end.worldY),
    bottom: Math.max(marqueeState.startWorldY, end.worldY),
  };
  const crossing = clientX < marqueeState.startClientX;
  return state.nodes.filter((node) => {
    if (!nodeIsVisible(node)) return false;
    const rect = {
      left: node.x,
      right: node.x + NODE_WIDTH,
      top: node.y,
      bottom: node.y + NODE_HEIGHT,
    };
    return crossing ? rectsIntersect(box, rect) : rectContains(box, rect);
  }).map((node) => node.id);
}

function closeMarquee() {
  marqueeState = null;
  els.selectionBox.classList.add("hidden");
  els.selectionBox.classList.remove("crossing");
  els.graphViewport.classList.remove("selecting");
}

function setCutMode(enabled) {
  cutMode = enabled;
  els.graphViewport.classList.toggle("cut-mode", enabled);
  if (enabled) {
    flashModeHint(tr("Y 剪线模式：拖过连线即可剪断", "Y cut mode: drag across wires to cut"));
  } else {
    endCutGesture();
    els.modeHint.classList.add("hidden");
  }
}

function handleCutPointerDown(event) {
  if (!cutMode || event.button !== 0) return;
  event.preventDefault();
  closeNodeMenu();
  const point = viewportPointFromClient(event.clientX, event.clientY);
  cutState = {
    pointerId: event.pointerId,
    lastWorldX: point.worldX,
    lastWorldY: point.worldY,
    lastClientX: event.clientX,
    lastClientY: event.clientY,
  };
  els.graphViewport.setPointerCapture?.(event.pointerId);
  renderCutLine(event.clientX, event.clientY, event.clientX, event.clientY);
}

function handleCutPointerMove(event) {
  if (!cutState) return;
  const point = viewportPointFromClient(event.clientX, event.clientY);
  cutConnectionsBySegment(
    { x: cutState.lastWorldX, y: cutState.lastWorldY },
    { x: point.worldX, y: point.worldY },
  );
  renderCutLine(cutState.lastClientX, cutState.lastClientY, event.clientX, event.clientY);
  cutState.lastWorldX = point.worldX;
  cutState.lastWorldY = point.worldY;
  cutState.lastClientX = event.clientX;
  cutState.lastClientY = event.clientY;
}

function handleCutPointerUp() {
  if (!cutState) return;
  endCutGesture();
}

function endCutGesture() {
  cutState = null;
  els.cutLayer.classList.add("hidden");
  els.cutLayer.innerHTML = "";
}

function renderCutLine(startClientX, startClientY, endClientX, endClientY) {
  const rect = els.graphViewport.getBoundingClientRect();
  els.cutLayer.classList.remove("hidden");
  els.cutLayer.innerHTML = `<line x1="${startClientX - rect.left}" y1="${startClientY - rect.top}" x2="${endClientX - rect.left}" y2="${endClientY - rect.top}"></line>`;
}

function handleViewportMouseDown(event) {
  if (event.button !== 1 || event.target.closest(".node-menu") || marqueeState) return;
  event.preventDefault();
  closeNodeMenu();
  panState = {
    startX: event.clientX,
    startY: event.clientY,
    panX: viewPan.x,
    panY: viewPan.y,
  };
  els.graphViewport.classList.add("panning");
}

function handleViewportMouseMove(event) {
  if (!panState) return;
  viewPan.x = panState.panX + (event.clientX - panState.startX);
  viewPan.y = panState.panY + (event.clientY - panState.startY);
  renderViewportTransform();
}

function handleViewportMouseUp() {
  if (!panState) return;
  panState = null;
  els.graphViewport.classList.remove("panning");
}

function selectNode(nodeId) {
  setSelectedNodes([nodeId], { render: false });
  selectedConnectionId = null;
  renderNodes();
  renderConnections();
  renderInspector();
}

function setSelectedNodes(ids, options = {}) {
  const validIds = ids.filter((id) => id && state.nodes.some((node) => node.id === id));
  selectedNodeIds = new Set(validIds);
  selectedNodeId = options.primaryId && selectedNodeIds.has(options.primaryId) ? options.primaryId : validIds[0] ?? null;
  if (selectedNodeIds.size) selectedConnectionId = null;
  if (options.render) {
    renderNodes();
    renderConnections();
    renderInspector();
  }
}

function addBoardNoteAtViewportCenter() {
  const rect = els.graphViewport.getBoundingClientRect();
  const point = viewportPointFromClient(rect.left + rect.width * 0.5, rect.top + rect.height * 0.42);
  const board = getActiveBoard();
  board.notes = normalizeBoardNotes(board.notes);
  const note = {
    id: makeId("note"),
    text: "",
    x: clamp(Math.round(point.worldX - BOARD_NOTE_WIDTH / 2), 40, WORLD_WIDTH - BOARD_NOTE_WIDTH - 40),
    y: clamp(Math.round(point.worldY - BOARD_NOTE_HEIGHT / 2), 40, WORLD_HEIGHT - BOARD_NOTE_HEIGHT - 40),
    width: BOARD_NOTE_WIDTH,
  };
  board.notes.push(note);
  selectedConnectionId = null;
  setSelectedNodes([], { render: false });
  saveState();
  renderAll();
  window.setTimeout(() => {
    els.boardNoteLayer.querySelector(`[data-board-note-text="${CSS.escape(note.id)}"]`)?.focus();
  }, 0);
}

function updateBoardNoteText(event) {
  const textarea = event.target.closest("[data-board-note-text]");
  if (!textarea) return;
  const note = getBoardNote(textarea.dataset.boardNoteText);
  if (!note) return;
  note.text = textarea.value;
  saveState();
}

function handleBoardNoteLayerClick(event) {
  const deleteButton = event.target.closest("[data-delete-board-note]");
  if (!deleteButton) return;
  const board = getActiveBoard();
  board.notes = (board.notes || []).filter((note) => note.id !== deleteButton.dataset.deleteBoardNote);
  saveState();
  renderBoardNotes();
}

function handleBoardNotePointerDown(event) {
  const card = event.target.closest(".board-note-card");
  if (!card || event.button !== 0 || !event.target.closest(".board-note-head") || event.target.closest("button")) return;
  const note = getBoardNote(card.dataset.boardNoteId);
  if (!note) return;
  event.preventDefault();
  event.stopPropagation();
  noteDragState = {
    id: note.id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originalX: note.x,
    originalY: note.y,
    card,
  };
  card.classList.add("dragging");
  card.setPointerCapture?.(event.pointerId);
}

function handleBoardNotePointerMove(event) {
  if (!noteDragState || noteDragState.pointerId !== event.pointerId) return;
  const note = getBoardNote(noteDragState.id);
  if (!note) return;
  const dx = (event.clientX - noteDragState.startX) / zoom;
  const dy = (event.clientY - noteDragState.startY) / zoom;
  note.x = clamp(Math.round(noteDragState.originalX + dx), 20, WORLD_WIDTH - BOARD_NOTE_WIDTH - 40);
  note.y = clamp(Math.round(noteDragState.originalY + dy), 20, WORLD_HEIGHT - BOARD_NOTE_HEIGHT - 40);
  noteDragState.card.style.transform = `translate(${note.x}px, ${note.y}px)`;
}

function handleBoardNotePointerUp(event) {
  if (!noteDragState || noteDragState.pointerId !== event.pointerId) return;
  noteDragState.card.classList.remove("dragging");
  noteDragState = null;
  saveState();
}

function getBoardNote(noteId) {
  return (getActiveBoard().notes || []).find((note) => note.id === noteId);
}

function updateSelectedNodeFromInspector() {
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!node) return;
  node.name = els.nodeNameInput.value.trim() || "node";
  node.type = els.nodeTypeInput.value.trim() || "null";
  node.group = els.nodeCategoryInput.value;
  node.inputCount = clampInt(els.nodeInputCountInput.value, 0, PORT_COUNT_MAX);
  node.outputCount = clampInt(els.nodeOutputCountInput.value, 0, PORT_COUNT_MAX);
  node.multiInput = els.nodeMultiInputInput.checked;
  node.note = els.nodeNoteInput.value;
  node.vexpression = els.nodeVexInput.value;
  node.color = colorForType(node.type, node.color);
  state.connections = state.connections.filter(
    (connection) =>
      !(connection.from === node.id && (connection.fromPort ?? 0) >= node.outputCount) &&
      !(connection.to === node.id && (connection.toPort ?? 0) >= node.inputCount),
  );
  saveState();
  renderCategories();
  renderNodes();
  renderConnections();
}

async function handleNoteImageInput() {
  const files = [...(els.noteImageInput.files || [])].filter((file) => file.type.startsWith("image/"));
  els.noteImageInput.value = "";
  await addNoteImages(files);
}

async function handleNoteImagePaste(event) {
  const files = clipboardImageFiles(event.clipboardData);
  if (!files.length) return;
  event.preventDefault();
  await addNoteImages(files);
}

async function handleNoteImageDrop(event) {
  const files = [...(event.dataTransfer?.files || [])].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  event.preventDefault();
  await addNoteImages(files);
}

async function addNoteImages(files) {
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!node || !files.length) {
    if (files.length) flashMeta(tr("先选择一个节点，再粘贴截图", "Select a node before pasting screenshots"));
    return 0;
  }
  node.noteImages = normalizeNoteImages(node.noteImages);
  const room = NOTE_IMAGE_MAX - node.noteImages.length;
  if (room <= 0) {
    flashMeta(tr(`每个节点最多 ${NOTE_IMAGE_MAX} 张截图`, `Up to ${NOTE_IMAGE_MAX} screenshots per node`));
    return 0;
  }

  const selectedFiles = files.slice(0, room);
  let added = 0;
  for (const file of selectedFiles) {
    try {
      const dataUrl = await compressImageFile(file, NOTE_IMAGE_MAX_EDGE, 0.78);
      node.noteImages.push({
        id: makeId("img"),
        name: file.name || tr("截图", "screenshot"),
        dataUrl,
        createdAt: new Date().toISOString(),
      });
      added += 1;
    } catch {
      flashMeta(tr("截图读取失败", "Screenshot failed to load"));
    }
  }
  saveState();
  renderNoteImages(node);
  renderNodes();
  if (added) flashMeta(tr(`已添加 ${added} 张截图`, `Added ${added} screenshot${added > 1 ? "s" : ""}`));
  return added;
}

function handleNoteImageListClick(event) {
  const deleteButton = event.target.closest("[data-delete-note-image]");
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!node) return;
  const previewButton = event.target.closest("[data-preview-note-image]");
  if (previewButton) {
    const image = (node.noteImages || []).find((item) => item.id === previewButton.dataset.previewNoteImage);
    if (image) openImagePreview(image.dataUrl, image.name);
    return;
  }
  if (!deleteButton) return;
  node.noteImages = (node.noteImages || []).filter((image) => image.id !== deleteButton.dataset.deleteNoteImage);
  saveState();
  renderNoteImages(node);
  renderNodes();
}

async function handleGlobalPaste(event) {
  if (event.defaultPrevented) return;
  const imageFiles = clipboardImageFiles(event.clipboardData);
  if (imageFiles.length) {
    event.preventDefault();
    await addNoteImages(imageFiles);
    return;
  }
  if (isEditableTarget(event.target)) return;
  let text = event.clipboardData?.getData("text/plain") || "";
  let parsed = text.trim() ? parseHoudiniClipboard(text) : { nodes: [], connections: [] };
  if (!parsed.nodes.length && serviceWorkspaceAvailable) {
    try {
      const response = await fetch("/api/clipboard-text", { cache: "no-store" });
      if (response.ok) {
        const result = await response.json();
        text = result?.text || text;
        parsed = text.trim() ? parseHoudiniClipboard(text) : parsed;
      }
    } catch {
      // Browser paste data remains the primary path.
    }
  }
  if (!parsed.nodes.length) return;
  event.preventDefault();
  importHoudiniClipboard(parsed);
}

function clipboardImageFiles(clipboardData) {
  const files = [];
  const seen = new Set();
  const addFile = (file) => {
    if (!file?.type?.startsWith("image/")) return;
    const key = [
      file.name || "clipboard-image",
      file.type,
      file.size,
      file.lastModified || 0,
    ].join(":");
    if (seen.has(key)) return;
    seen.add(key);
    files.push(file);
  };
  [...(clipboardData?.files || [])].forEach((file) => {
    addFile(file);
  });
  [...(clipboardData?.items || [])].forEach((item) => {
    if (!item?.type?.startsWith("image/")) return;
    addFile(item.getAsFile?.());
  });
  return files;
}

function isEditableTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return Boolean(target?.isContentEditable || ["input", "textarea", "select"].includes(tag));
}

function parseHoudiniClipboard(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const commands = splitClipboardCommands(text);
  const hasHoudiniSignal = /(^|\s)(opadd|opwire|opparm|oplocate|opcf|hou\.node|set\s+-g\s+_HIP|\/(?:obj|stage|mat|shop|out|img|ch|tasks|cop|cop2|lop|rop|sop|top|vop)\/)/i.test(text);
  const descriptors = [];
  const byKey = new Map();
  const addDescriptor = (name, type = "", meta = {}) => {
    const cleanName = cleanHoudiniNodeName(name);
    if (!cleanName) return null;
    const key = cleanName.toLowerCase();
    if (byKey.has(key)) {
      const existing = byKey.get(key);
      mergeDescriptorMeta(existing, meta);
      return existing;
    }
    const cleanType = cleanHoudiniNodeType(type) || guessTypeFromName(cleanName);
    const descriptor = {
      key,
      name: cleanName,
      type: cleanType,
      group: groupForType(cleanType),
      hx: null,
      hy: null,
      parentPath: "",
      sourcePath: "",
      pathListOrder: null,
    };
    mergeDescriptorMeta(descriptor, meta);
    byKey.set(key, descriptor);
    descriptors.push(descriptor);
    return descriptor;
  };

  commands.forEach((line) => {
    const tokens = tokenizeClipboardLine(line);
    if (!tokens.length) return;
    if (/^opadd$/i.test(tokens[0])) {
      const meaningful = commandOperands(tokens.slice(1));
      if (meaningful.length >= 2) addDescriptor(meaningful[meaningful.length - 1], meaningful[meaningful.length - 2]);
    }
  });

  commands.forEach((line) => {
    const tokens = tokenizeClipboardLine(line);
    if (!tokens.length || !/^oplocate$/i.test(tokens[0])) return;
    const name = commandOperands(tokens.slice(1)).at(-1);
    const descriptor = resolveHoudiniDescriptor(name, byKey) || addDescriptor(name, "");
    if (!descriptor) return;
    const xIndex = tokens.findIndex((token) => /^-x$/i.test(token));
    const yIndex = tokens.findIndex((token) => /^-y$/i.test(token));
    const inlineX = line.match(/(?:^|\s)x(?:pos)?\s*[=:]\s*(-?\d+(?:\.\d+)?)/i);
    const inlineY = line.match(/(?:^|\s)y(?:pos)?\s*[=:]\s*(-?\d+(?:\.\d+)?)/i);
    const hx = xIndex >= 0 ? Number(tokens[xIndex + 1]) : inlineX ? Number(inlineX[1]) : NaN;
    const hy = yIndex >= 0 ? Number(tokens[yIndex + 1]) : inlineY ? Number(inlineY[1]) : NaN;
    if (Number.isFinite(hx)) descriptor.hx = hx;
    if (Number.isFinite(hy)) descriptor.hy = hy;
  });

  if (hasHoudiniSignal) {
    const pathMatches = houdiniPathMatches(text);
    pathMatches.forEach((path, index) => {
      const parts = path.split("/").filter(Boolean);
      const nodeName = parts.at(-1) || "";
      const parentPath = `/${parts.slice(0, -1).join("/")}`;
      addDescriptor(nodeName, guessTypeFromName(nodeName), {
        parentPath,
        sourcePath: path,
        pathListOrder: index,
      });
    });
  }

  if (!descriptors.length && hasHoudiniSignal) {
    buildCandidatesFromText(text).slice(0, 32).forEach((candidate) => addDescriptor(candidate.name, candidate.type));
  }

  if (!descriptors.length) {
    const arrowLines = lines.filter((line) => /(?:->|=>|-->)/.test(line));
    if (arrowLines.length) {
      arrowLines.forEach((line) => {
        const [from, to] = line.split(/(?:->|=>|-->)/);
        addDescriptor(from, "");
        addDescriptor(to, "");
      });
    }
  }

  const connections = [];
  const addConnection = (from, to, fromPort = 0, toPort = 0) => {
    const source = resolveHoudiniDescriptor(from, byKey);
    const target = resolveHoudiniDescriptor(to, byKey);
    if (!source || !target || source.key === target.key) return;
    if (connections.some((connection) => connection.fromKey === source.key && connection.toKey === target.key)) return;
    connections.push({
      fromKey: source.key,
      toKey: target.key,
      fromPort,
      toPort,
    });
  };

  commands.forEach((line) => {
    const arrowMatch = line.match(/(.+?)(?:->|=>|-->)\s*(.+)/);
    if (arrowMatch) {
      addConnection(arrowMatch[1], arrowMatch[2]);
      return;
    }
    const setInputMatch = line.match(/hou\.node\(["']([^"']+)["']\)\.setInput\(\s*(\d+)\s*,\s*hou\.node\(["']([^"']+)["']\)/i);
    if (setInputMatch) {
      addDescriptor(setInputMatch[1].split("/").filter(Boolean).at(-1), "");
      addDescriptor(setInputMatch[3].split("/").filter(Boolean).at(-1), "");
      addConnection(setInputMatch[3], setInputMatch[1], 0, Number(setInputMatch[2]) || 0);
      return;
    }
    if (!/\bopwire\b/i.test(line)) return;
    const opwireConnections = opwireConnectionsFromTokens(tokenizeClipboardLine(line), byKey, addDescriptor);
    if (opwireConnections.length) {
      opwireConnections.forEach((connection) => {
        addConnection(connection.from, connection.to, connection.fromPort, connection.toPort);
      });
      return;
    }
    const mentioned = descriptors
      .map((descriptor) => ({ descriptor, index: nodeRefIndexInLine(descriptor.name, line) }))
      .filter((item) => item.index >= 0)
      .sort((a, b) => a.index - b.index)
      .map((item) => item.descriptor);
    if (mentioned.length >= 2) {
      addConnection(mentioned[0].name, mentioned[mentioned.length - 1].name);
      return;
    }
    const endpoints = opwireEndpoints(tokenizeClipboardLine(line), byKey);
    if (endpoints) addConnection(endpoints.from, endpoints.to, endpoints.fromPort, endpoints.toPort);
  });

  let inferredConnectionMode = "";
  if (!connections.length) {
    const inferred = inferClipboardConnections(descriptors);
    inferred.forEach((connection) => {
      if (!connections.some((item) => item.fromKey === connection.fromKey && item.toKey === connection.toKey)) connections.push(connection);
    });
    if (inferred.length) inferredConnectionMode = "layout";
  }

  if (!connections.length) {
    const inferred = inferPathListConnections(descriptors);
    inferred.forEach((connection) => {
      if (!connections.some((item) => item.fromKey === connection.fromKey && item.toKey === connection.toKey)) connections.push(connection);
    });
    if (inferred.length) inferredConnectionMode = "path-list";
  }

  return {
    nodes: descriptors.slice(0, 64),
    connections,
    inferredConnectionMode,
  };
}

function importHoudiniClipboard(parsed) {
  const placement = findHoudiniClipboardPlacement(parsed.nodes);
  const idByKey = new Map();
  const createdIds = [];
  let createdConnectionCount = 0;
  parsed.nodes.forEach((descriptor, index) => {
    const position = placement[index];
    const type = descriptor.type || guessTypeFromName(descriptor.name);
    const defaults = defaultPortsForType(type);
    const node = {
      id: makeId("n"),
      name: uniqueNodeName(descriptor.name),
      type,
      group: descriptor.group || groupForType(type),
      ...defaults,
      x: position.x,
      y: position.y,
      color: colorForType(type),
      note: tr("来自 Houdini 剪贴板", "Imported from Houdini clipboard"),
      vexpression: "",
      noteImages: [],
      params: [["source", "houdini clipboard"]],
    };
    state.nodes.push(node);
    idByKey.set(descriptor.key, node.id);
    createdIds.push(node.id);
  });

  parsed.connections.forEach((connection) => {
    const from = idByKey.get(connection.fromKey);
    const to = idByKey.get(connection.toKey);
    const target = getNode(to);
    const source = getNode(from);
    if (!from || !to || !target || !source) return;
    if (source.outputCount < 1 || target.inputCount < 1) return;
    const requestedToPort = clampInt(connection.toPort || 0, 0, PORT_COUNT_MAX - 1);
    const requestedFromPort = clampInt(connection.fromPort || 0, 0, PORT_COUNT_MAX - 1);
    if (target.inputCount <= requestedToPort) target.inputCount = requestedToPort + 1;
    if (source.outputCount <= requestedFromPort) source.outputCount = requestedFromPort + 1;
    const toPort = target.multiInput || requestedToPort > 0 ? Math.min(target.inputCount - 1, requestedToPort) : 0;
    state.connections.push({
      id: makeId("c"),
      from,
      to,
      fromPort: clampInt(requestedFromPort, 0, Math.max(0, source.outputCount - 1)),
      toPort: clampInt(toPort, 0, Math.max(0, target.inputCount - 1)),
    });
    createdConnectionCount += 1;
  });

  setSelectedNodes(createdIds, { primaryId: createdIds[0], render: false });
  selectedConnectionId = null;
  connectionSourceId = null;
  pendingWirePoint = null;
  saveState();
  renderAll();
  focusNodes(createdIds, true);
  const inferredLabel = parsed.inferredConnectionMode ? tr("推断", "inferred ") : "";
  flashMeta(tr(`已粘贴 ${createdIds.length} 个 Houdini 节点 / ${createdConnectionCount} 条${inferredLabel}连线`, `Pasted ${createdIds.length} Houdini nodes / ${createdConnectionCount} ${inferredLabel}wires`));
}

function mergeDescriptorMeta(descriptor, meta = {}) {
  if (meta.parentPath && !descriptor.parentPath) descriptor.parentPath = meta.parentPath;
  if (meta.sourcePath && !descriptor.sourcePath) descriptor.sourcePath = meta.sourcePath;
  if (Number.isFinite(meta.pathListOrder) && descriptor.pathListOrder === null) descriptor.pathListOrder = meta.pathListOrder;
}

function tokenizeClipboardLine(line) {
  return [...String(line).matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((match) => match[1] ?? match[2] ?? match[3]);
}

function splitClipboardCommands(text) {
  const commands = [];
  let current = "";
  let quote = "";
  let escaped = false;
  const source = String(text || "").replace(/\\\r?\n/g, " ");
  for (const char of source) {
    if (quote) {
      current += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === ";" || char === "\n" || char === "\r") {
      const command = current.trim();
      if (command) commands.push(command);
      current = "";
      continue;
    }
    current += char;
  }
  const tail = current.trim();
  if (tail) commands.push(tail);
  return commands;
}

function houdiniPathMatches(text) {
  return [...String(text || "").matchAll(/\/(?:obj|stage|mat|shop|out|img|ch|tasks|cop|cop2|lop|rop|sop|top|vop)\/[A-Za-z0-9_./:-]+/gi)]
    .map((match) => match[0].replace(/[),;]+$/g, ""))
    .filter(Boolean);
}

function commandOperands(tokens) {
  const operands = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token) continue;
    if (/^-[a-zA-Z]+$/.test(token)) {
      if (["-x", "-y", "-z", "-r", "-g", "-p"].includes(token.toLowerCase())) index += 1;
      continue;
    }
    if (/^-\d+$/.test(token)) continue;
    operands.push(token);
  }
  return operands;
}

function opwireEndpoints(tokens, byKey) {
  const structured = opwireConnectionsFromTokens(tokens, byKey);
  if (structured.length) return structured[0];
  const operands = commandOperands(tokens.slice(1)).filter((token) => !/^-?\d+(?:\.\d+)?$/.test(token));
  const resolved = operands
    .map((token, index) => ({ token, descriptor: resolveHoudiniDescriptor(token, byKey), index }))
    .filter((item) => item.descriptor);
  if (resolved.length < 2) return null;
  const fromItem = resolved[0];
  const toItem = resolved[resolved.length - 1];
  return {
    from: fromItem.token,
    to: toItem.token,
    fromPort: portNumberNearToken(tokens, fromItem.token, 0),
    toPort: portNumberNearToken(tokens, toItem.token, 0),
  };
}

function opwireConnectionsFromTokens(tokens, byKey, addDescriptor = null) {
  if (!tokens.length || !/^opwire$/i.test(tokens[0])) return [];
  const connections = [];
  let outputPort = 0;
  let sourceToken = "";
  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    const lower = String(token || "").toLowerCase();
    if (!token) continue;
    if (lower === "-n" || lower === "-i") continue;
    if (lower === "-o") {
      outputPort = Number(tokens[index + 1]) || 0;
      index += 1;
      continue;
    }
    const inlineOutput = lower.match(/^-o(\d+)$/);
    if (inlineOutput) {
      outputPort = Number(inlineOutput[1]) || 0;
      continue;
    }
    const inputPort = opwireInputPort(token);
    if (inputPort !== null) {
      const targetToken = tokens[index + 1] || "";
      if (sourceToken && targetToken) {
        if (addDescriptor) {
          addDescriptor(sourceToken, "");
          addDescriptor(targetToken, "");
        }
        if (resolveHoudiniDescriptor(sourceToken, byKey) && resolveHoudiniDescriptor(targetToken, byKey)) {
          connections.push({
            from: sourceToken,
            to: targetToken,
            fromPort: outputPort,
            toPort: inputPort,
          });
        }
      }
      index += 1;
      continue;
    }
    if (/^-[a-zA-Z]+$/.test(token)) continue;
    if (!sourceToken) sourceToken = token;
  }
  return connections;
}

function opwireInputPort(token) {
  const match = String(token || "").match(/^-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function portNumberNearToken(tokens, token, fallback) {
  const index = tokens.findIndex((item) => cleanHoudiniNodeName(item).toLowerCase() === cleanHoudiniNodeName(token).toLowerCase());
  const neighbors = [tokens[index + 1], tokens[index - 1]];
  for (const neighbor of neighbors) {
    const match = String(neighbor || "").match(/^-?(\d+)$/);
    if (match) return Number(match[1]);
  }
  const inline = String(token || "").match(/:(\d+)$/);
  return inline ? Number(inline[1]) : fallback;
}

function inferClipboardConnections(descriptors) {
  const positioned = descriptors.filter((descriptor) => Number.isFinite(descriptor.hx) && Number.isFinite(descriptor.hy));
  if (positioned.length < 2 || positioned.length !== descriptors.length || descriptors.length > 12) return [];
  const sorted = [...positioned].sort((a, b) => b.hy - a.hy || a.hx - b.hx);
  const rangeX = Math.max(...sorted.map((item) => item.hx)) - Math.min(...sorted.map((item) => item.hx));
  const maxStepX = rangeX <= 5 ? 999 : Math.max(3, rangeX * 0.55);
  const connections = [];
  for (let index = 0; index < sorted.length - 1; index += 1) {
    const from = sorted[index];
    const to = sorted[index + 1];
    if (Math.abs(from.hx - to.hx) > maxStepX) continue;
    connections.push({
      fromKey: from.key,
      toKey: to.key,
      fromPort: 0,
      toPort: 0,
    });
  }
  return connections;
}

function inferPathListConnections(descriptors) {
  const ordered = descriptors
    .filter((descriptor) => Number.isFinite(descriptor.pathListOrder))
    .sort((a, b) => a.pathListOrder - b.pathListOrder);
  if (ordered.length < 2) return [];
  const groups = new Map();
  ordered.forEach((descriptor) => {
    const key = descriptor.parentPath || "__root__";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(descriptor);
  });
  const connections = [];
  groups.forEach((nodes) => {
    if (nodes.length < 2) return;
    for (let index = 0; index < nodes.length - 1; index += 1) {
      connections.push({
        fromKey: nodes[index].key,
        toKey: nodes[index + 1].key,
        fromPort: 0,
        toPort: 0,
      });
    }
  });
  return connections;
}

function findHoudiniClipboardPlacement(nodes) {
  const positioned = nodes.filter((node) => Number.isFinite(node.hx) && Number.isFinite(node.hy));
  const pathOrdered = nodes.filter((node) => Number.isFinite(node.pathListOrder));
  if (pathOrdered.length >= 2 && positioned.length < 2) return findOrderedPathListPlacement(nodes);
  if (positioned.length < Math.max(2, Math.floor(nodes.length * 0.5))) return findImportPlacement(nodes.length);
  const anchor = findImportPlacement(1)[0];
  const minX = Math.min(...positioned.map((node) => node.hx));
  const maxY = Math.max(...positioned.map((node) => node.hy));
  const unitX = 260;
  const unitY = 150;
  const fallback = findImportPlacement(nodes.length);
  return nodes.map((node, index) => {
    if (!Number.isFinite(node.hx) || !Number.isFinite(node.hy)) return fallback[index];
    return {
      x: clamp(Math.round(anchor.x + (node.hx - minX) * unitX), 40, WORLD_WIDTH - NODE_WIDTH - 220),
      y: clamp(Math.round(anchor.y + (maxY - node.hy) * unitY), 40, WORLD_HEIGHT - NODE_HEIGHT - 40),
    };
  });
}

function findOrderedPathListPlacement(nodes) {
  const anchor = findImportPlacement(1)[0];
  const usableHeight = WORLD_HEIGHT - anchor.y - NODE_HEIGHT - 80;
  const maxRows = Math.max(1, Math.floor(usableHeight / IMPORT_NODE_GAP_Y));
  return nodes.map((node, index) => {
    const order = Number.isFinite(node.pathListOrder) ? node.pathListOrder : index;
    const column = Math.floor(order / maxRows);
    const row = order % maxRows;
    return {
      x: clamp(anchor.x + column * IMPORT_NODE_GAP_X, 40, WORLD_WIDTH - NODE_WIDTH - 220),
      y: clamp(anchor.y + row * IMPORT_NODE_GAP_Y, 40, WORLD_HEIGHT - NODE_HEIGHT - 40),
    };
  });
}

function cleanHoudiniNodeName(value) {
  const last = String(value || "").split(/[\\/]/).filter(Boolean).at(-1) || "";
  return last.replace(/:\d+$/g, "").replace(/\.[A-Za-z0-9]+$/g, "").replace(/[^A-Za-z0-9_:-]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
}

function cleanHoudiniNodeType(value) {
  return String(value || "").split("::")[0].replace(/[^A-Za-z0-9_]/g, "").toLowerCase();
}

function resolveHoudiniDescriptor(value, byKey) {
  const key = cleanHoudiniNodeName(value).toLowerCase();
  return byKey.get(key) || null;
}

function nodeRefAppearsInLine(name, line) {
  return nodeRefIndexInLine(name, line) >= 0;
}

function nodeRefIndexInLine(name, line) {
  const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`, "i").exec(line);
  return match ? match.index : -1;
}

function compressImageFile(file, maxEdge, quality = 0.82, mode = "normal") {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: mode === "ocr" });
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        URL.revokeObjectURL(image.src);

        if (mode === "ocr") {
          const pixels = ctx.getImageData(0, 0, width, height);
          const data = pixels.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            const value = gray > 118 ? 255 : 0;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
          }
          ctx.putImageData(pixels, 0, 0);
          resolve(canvas.toDataURL("image/png"));
          return;
        }

        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (error) {
        URL.revokeObjectURL(image.src);
        reject(error);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error("image load failed"));
    };
    image.src = URL.createObjectURL(file);
  });
}

function addParam() {
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!node) return;
  node.params.push(["parm", ""]);
  saveState();
  renderParams(node);
  renderNodes();
}

function updateParam(event) {
  const input = event.target.closest("input[data-param-field]");
  if (!input) return;
  const row = input.closest("[data-param-index]");
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!row || !node) return;
  const index = Number(row.dataset.paramIndex);
  const fieldIndex = input.dataset.paramField === "key" ? 0 : 1;
  node.params[index][fieldIndex] = input.value;
  saveState();
  renderNodes();
}

function deleteParam(event) {
  const button = event.target.closest("[data-delete-param]");
  if (!button) return;
  const node = selectedNodeId ? getNode(selectedNodeId) : null;
  if (!node) return;
  node.params.splice(Number(button.dataset.deleteParam), 1);
  saveState();
  renderParams(node);
  renderNodes();
}

function addNodeFromKind(kind, position = null) {
  const selected = selectedNodeId ? getNode(selectedNodeId) : null;
  const center = viewportPointFromClient(
    els.graphViewport.getBoundingClientRect().left + els.graphViewport.clientWidth * 0.42,
    els.graphViewport.getBoundingClientRect().top + els.graphViewport.clientHeight * 0.32,
  );
  const x = position
    ? position.x
    : selected
    ? selected.x
    : Math.round(center.worldX);
  const y = position
    ? position.y
    : selected
    ? selected.y + 165
    : Math.round(center.worldY);
  const node = {
    id: makeId("n"),
    name: uniqueNodeName(kind.type),
    type: kind.type,
    group: kind.group,
    ...defaultPortsForType(kind.type),
    x: clamp(x, 40, WORLD_WIDTH - NODE_WIDTH - 220),
    y: clamp(y, 40, WORLD_HEIGHT - NODE_HEIGHT - 40),
    color: kind.color,
    note: "",
    vexpression: "",
    noteImages: [],
    params: cloneState(kind.params),
  };
  state.nodes.push(node);
  setSelectedNodes([node.id], { render: false });
  selectedConnectionId = null;
  saveState();
  renderAll();
}

function addBoard() {
  const name = window.prompt(tr("画板名称", "Board name"), tr("新的节点连接收藏", "New node wiring reference"));
  if (!name?.trim()) return;
  const color = COLOR_POOL[state.boards.length % COLOR_POOL.length];
  const board = {
    id: makeId("board"),
    name: name.trim(),
    color,
    folderId: activeFolderId || "",
    notes: [],
    nodes: [],
    connections: [],
  };
  state.boards.push(board);
  state.activeBoardId = board.id;
  activeFolderId = board.folderId || "";
  setSelectedNodes([], { render: false });
  selectedConnectionId = null;
  saveState();
  renderAll();
}

function addBoardFolder() {
  const name = window.prompt(tr("文件夹名称", "Folder name"), tr("新的文件夹", "New folder"));
  if (!name?.trim()) return;
  const folder = {
    id: makeId("folder"),
    name: name.trim(),
    collapsed: false,
  };
  state.boardFolders.push(folder);
  activeFolderId = folder.id;
  saveState();
  renderCategories();
}

function renameBoard(boardId) {
  const board = state.boards.find((item) => item.id === boardId);
  if (!board) return;
  const name = window.prompt(tr("画板名称", "Board name"), board.name);
  if (!name?.trim()) return;
  board.name = name.trim();
  saveState();
  renderAll();
}

function renameFolder(folderId) {
  const folder = state.boardFolders.find((item) => item.id === folderId);
  if (!folder) return;
  const name = window.prompt(tr("文件夹名称", "Folder name"), folder.name);
  if (!name?.trim()) return;
  folder.name = name.trim();
  saveState();
  renderCategories();
}

function moveBoardToFolder(boardId) {
  const board = state.boards.find((item) => item.id === boardId);
  if (!board) return;
  const current = folderName(board.folderId || "");
  const name = window.prompt(tr(`移动到文件夹：输入文件夹名称，留空移到未分类。当前：${current}`, `Move to folder: enter a folder name, or leave blank for Unfiled. Current: ${current}`), current === tr("未分类", "Unfiled") ? "" : current);
  if (name === null) return;
  const clean = name.trim();
  if (!clean) {
    board.folderId = "";
    activeFolderId = "";
  } else {
    let folder = state.boardFolders.find((item) => item.name.toLowerCase() === clean.toLowerCase());
    if (!folder) {
      folder = { id: makeId("folder"), name: clean, collapsed: false };
      state.boardFolders.push(folder);
    }
    board.folderId = folder.id;
    activeFolderId = folder.id;
  }
  saveState();
  renderCategories();
}

function deleteSelection() {
  if (selectedNodeIds.size) {
    const ids = new Set(selectedNodeIds);
    state.nodes = state.nodes.filter((node) => !ids.has(node.id));
    state.connections = state.connections.filter((connection) => !ids.has(connection.from) && !ids.has(connection.to));
    setSelectedNodes([], { render: false });
    saveState();
    renderAll();
    return;
  }

  if (selectedConnectionId) {
    state.connections = state.connections.filter((connection) => connection.id !== selectedConnectionId);
    selectedConnectionId = null;
    saveState();
    renderAll();
  }
}

function disconnectNodes(ids) {
  const set = new Set(ids);
  const before = state.connections.length;
  state.connections = state.connections.filter((connection) => !set.has(connection.from) && !set.has(connection.to));
  const removed = before - state.connections.length;
  if (removed) saveState();
  return removed;
}

function cutConnectionsBySegment(a, b) {
  if (Math.hypot(a.x - b.x, a.y - b.y) < 2) return 0;
  const before = state.connections.length;
  state.connections = state.connections.filter((connection) => {
    const from = getNode(connection.from);
    const to = getNode(connection.to);
    if (!from || !to) return false;
    return !segmentCutsConnection(a, b, from, to, connection);
  });
  const removed = before - state.connections.length;
  if (removed) {
    saveState();
    renderConnections();
    flashModeHint(tr(`剪断 ${removed} 条连线`, `Cut ${removed} wires`));
  }
  return removed;
}

function exportActiveBoard() {
  const board = getActiveBoard();
  downloadJson(JSON.stringify(board, null, 2), `houdini-board-${slugify(board.name)}-${new Date().toISOString().slice(0, 10)}.json`);
}

function importBoardJson() {
  const file = els.boardImportInput.files?.[0];
  if (!file) return;
  importJsonFile(file).finally(() => {
    els.boardImportInput.value = "";
  });
}

function updateZoom() {
  els.zoomValue.textContent = `${Math.round(zoom * 100)}%`;
  renderViewportTransform();
}

function handleWheelZoom(event) {
  if (event.target.closest(".node-menu, .inspector, .sidebar")) return;
  event.preventDefault();
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoomAtPoint(event.clientX, event.clientY, clamp(zoom * factor, 0.25, 2));
}

function zoomAtViewportCenter(nextZoom) {
  const rect = els.graphViewport.getBoundingClientRect();
  zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, nextZoom);
}

function zoomAtPoint(clientX, clientY, nextZoom) {
  const rect = els.graphViewport.getBoundingClientRect();
  const before = viewportPointFromClient(clientX, clientY);
  zoom = clamp(nextZoom, 0.25, 2);
  viewPan.x = clientX - rect.left - before.worldX * zoom;
  viewPan.y = clientY - rect.top - before.worldY * zoom;
  els.zoomRange.value = String(Math.round(zoom * 100));
  updateZoom();
}

function fitGraph(animate) {
  const visibleNodes = state.nodes.filter(nodeIsVisible);
  const notes = getActiveBoard().notes || [];
  const items = [
    ...visibleNodes.map((node) => ({ x: node.x, y: node.y })),
    ...notes.map((note) => ({ x: note.x, y: note.y })),
  ];
  if (!items.length) return;
  const minX = Math.max(0, Math.min(...items.map((item) => item.x)) - 140);
  const minY = Math.max(0, Math.min(...items.map((item) => item.y)) - 110);
  viewPan.x = -minX * zoom + 40;
  viewPan.y = -minY * zoom + 40;
  renderViewportTransform();
}

function focusNodes(ids, animate) {
  const nodes = ids.map((id) => getNode(id)).filter(Boolean);
  if (!nodes.length) return;
  const minX = Math.max(0, Math.min(...nodes.map((node) => node.x)) - 120);
  const minY = Math.max(0, Math.min(...nodes.map((node) => node.y)) - 120);
  viewPan.x = -minX * zoom + 40;
  viewPan.y = -minY * zoom + 40;
  renderViewportTransform();
}

function openNodeMenuAtViewportCenter() {
  const rect = els.graphViewport.getBoundingClientRect();
  openNodeMenuAtScreenPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.38);
}

function openNodeMenuAtScreenPoint(clientX, clientY) {
  const rect = els.graphViewport.getBoundingClientRect();
  const localX = clamp(clientX - rect.left, 14, Math.max(14, rect.width - 460));
  const localY = clamp(clientY - rect.top, 14, Math.max(14, rect.height - 330));
  nodeMenuPosition = {
    screenX: localX,
    screenY: localY,
    x: Math.round(viewportPointFromClient(clientX, clientY).worldX - NODE_WIDTH / 2),
    y: Math.round(viewportPointFromClient(clientX, clientY).worldY - 18),
  };
  nodeMenuQuery = "";
  els.nodeSearchInput.value = "";
  els.nodeMenu.style.left = `${localX}px`;
  els.nodeMenu.style.top = `${localY}px`;
  els.nodeMenu.classList.remove("hidden");
  renderPalette();
  window.setTimeout(() => els.nodeSearchInput.focus(), 0);
}

function closeNodeMenu() {
  els.nodeMenu.classList.add("hidden");
}

function toggleGraphSearch() {
  const wasHidden = els.graphSearch.classList.contains("hidden");
  els.graphSearch.classList.toggle("hidden", !wasHidden);
  if (wasHidden) {
    window.setTimeout(() => {
      els.globalSearch.focus();
      els.globalSearch.select();
    }, 0);
  }
}

function closeGraphSearch() {
  els.graphSearch.classList.add("hidden");
}

function openScreenshotModal() {
  els.screenshotModal.classList.remove("hidden");
  renderCandidates();
}

function closeScreenshotModal() {
  els.screenshotModal.classList.add("hidden");
}

function loadScreenshotFile(file) {
  currentImageFile = file;
  cachedVisualCandidates = [];
  cachedOcrImage = "";
  cachedOcrText = "";
  const img = new Image();
  img.onload = () => {
    const maxWidth = 1100;
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = els.screenshotCanvas;
    canvas.width = Math.max(320, Math.round(img.width * scale));
    canvas.height = Math.max(220, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(img.src);
    els.importStatus.textContent = tr("已载入截图", "Screenshot loaded");
    cachedVisualCandidates = detectVisualCandidates();
    importCandidates = cachedVisualCandidates;
    renderCandidates();
  };
  img.onerror = () => {
    els.importStatus.textContent = tr("截图载入失败", "Screenshot failed to load");
  };
  img.src = URL.createObjectURL(file);
}

async function runScreenshotRecognition() {
  els.importStatus.textContent = tr("快速扫描中", "Fast scan");
  let text = els.ocrText.value.trim();
  const visualCandidates = currentImageFile ? cachedVisualCandidates.length ? cachedVisualCandidates : detectVisualCandidates() : [];
  cachedVisualCandidates = visualCandidates;
  let textCandidates = buildCandidatesFromText(text);

  if (textCandidates.length && textCandidates.length >= Math.max(1, Math.floor(visualCandidates.length * 0.7))) {
    importCandidates = mergeImportCandidates(textCandidates, visualCandidates);
    els.importStatus.textContent = tr(`找到 ${importCandidates.length} 个候选`, `Found ${importCandidates.length} candidates`);
    renderCandidates();
    return;
  }

  const tesseract = currentImageFile ? await loadTesseract() : null;

  if (currentImageFile && tesseract) {
    try {
      els.importStatus.textContent = tr("OCR 预处理中", "Preprocessing OCR");
      if (!cachedOcrImage) {
        cachedOcrImage = await compressImageFile(currentImageFile, OCR_IMAGE_MAX_EDGE, 1, "ocr");
      }
      if (!cachedOcrText) {
        const result = await tesseract.recognize(cachedOcrImage, "eng", {
          tessedit_pageseg_mode: "6",
          logger(message) {
            if (message.status) {
              const progress = message.progress ? ` ${Math.round(message.progress * 100)}%` : "";
              els.importStatus.textContent = `${message.status}${progress}`;
            }
          },
        });
        cachedOcrText = result.data?.text?.trim() || "";
      }
      text = cachedOcrText || text;
      els.ocrText.value = text;
    } catch {
      els.importStatus.textContent = tr("OCR 失败，已使用视觉块", "OCR failed; using visual blocks");
    }
  } else if (currentImageFile) {
    els.importStatus.textContent = tr("OCR 离线，已使用视觉块", "OCR offline; using visual blocks");
  }

  textCandidates = buildCandidatesFromText(text);
  importCandidates = mergeImportCandidates(textCandidates, visualCandidates);
  els.importStatus.textContent = importCandidates.length ? tr(`找到 ${importCandidates.length} 个候选`, `Found ${importCandidates.length} candidates`) : tr("没有候选", "No candidates");
  renderCandidates();
}

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tesseractLoadPromise) return tesseractLoadPromise;

  tesseractLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => finish(window.Tesseract ?? null);
    script.onerror = () => finish(null);
    window.setTimeout(() => finish(null), 8000);
    document.head.appendChild(script);
  });

  return tesseractLoadPromise;
}

function buildCandidatesFromText(text) {
  const tokens = (text.match(/[A-Za-z][A-Za-z0-9_./-]{1,44}/g) || [])
    .map((token) => token.replace(/[./-]+$/g, ""))
    .filter(Boolean);
  const ignore = new Set([
    "houdini",
    "sidefx",
    "network",
    "geometry",
    "material",
    "display",
    "render",
    "template",
    "bypass",
    "input",
    "output",
    "color",
    "alpha",
    "points",
    "primitives",
  ]);
  const known = [
    "file",
    "attrib",
    "wrangle",
    "mountain",
    "null",
    "merge",
    "blast",
    "group",
    "copy",
    "solver",
    "dop",
    "pyro",
    "karma",
    "material",
    "subnet",
    "switch",
    "transform",
    "poly",
    "cache",
    "rop",
    "lop",
    "vop",
  ];
  const seen = new Set();
  const names = [];
  tokens.forEach((token) => {
    const clean = token.replace(/[^A-Za-z0-9_]/g, "_").replace(/_+/g, "_");
    const lower = clean.toLowerCase();
    if (ignore.has(lower) || seen.has(lower) || clean.length < 3) return;
    const looksUseful = known.some((part) => lower.includes(part)) || /\d/.test(clean) || clean.includes("_");
    if (!looksUseful) return;
    seen.add(lower);
    names.push(clean);
  });

  return names.slice(0, 18).map((name, index) => ({
    name,
    type: guessTypeFromName(name),
    x: 430 + Math.floor(index / 8) * 300,
    y: 120 + (index % 8) * 155,
    color: colorForType(guessTypeFromName(name)),
    source: "OCR",
  }));
}

function detectVisualCandidates() {
  const canvas = els.screenshotCanvas;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!canvas.width || !canvas.height) return [];
  const step = 8;
  const cols = Math.floor(canvas.width / step);
  const rows = Math.floor(canvas.height / step);
  if (cols < 8 || rows < 8) return [];
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const mask = new Uint8Array(cols * rows);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = Math.min(canvas.width - 1, x * step + Math.floor(step / 2));
      const py = Math.min(canvas.height - 1, y * step + Math.floor(step / 2));
      const index = (py * canvas.width + px) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const brightness = (r + g + b) / 3;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const isGridDot = brightness > 215 && chroma < 12;
      const isNodeLike = brightness > 42 && brightness < 235 && !isGridDot && (chroma > 18 || brightness > 72);
      if (isNodeLike) mask[y * cols + x] = 1;
    }
  }

  const visited = new Uint8Array(cols * rows);
  const clusters = [];
  const neighbors = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const start = y * cols + x;
      if (!mask[start] || visited[start]) continue;
      const queue = [[x, y]];
      visited[start] = 1;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      let count = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;

      while (queue.length) {
        const [cx, cy] = queue.shift();
        count += 1;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);

        const px = Math.min(canvas.width - 1, cx * step + Math.floor(step / 2));
        const py = Math.min(canvas.height - 1, cy * step + Math.floor(step / 2));
        const pixelIndex = (py * canvas.width + px) * 4;
        sumR += data[pixelIndex];
        sumG += data[pixelIndex + 1];
        sumB += data[pixelIndex + 2];

        neighbors.forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
          const next = ny * cols + nx;
          if (!mask[next] || visited[next]) return;
          visited[next] = 1;
          queue.push([nx, ny]);
        });
      }

      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const area = width * height;
      const fill = count / area;
      if (count < 10 || width < 4 || height < 2 || width > 80 || height > 26 || fill < 0.24) continue;
      clusters.push({
        x: minX * step,
        y: minY * step,
        w: width * step,
        h: height * step,
        color: rgbToHex(Math.round(sumR / count), Math.round(sumG / count), Math.round(sumB / count)),
        count,
      });
    }
  }

  return clusters
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .slice(0, 18)
    .map((cluster, index) => {
      const type = guessTypeFromColor(cluster.color);
      return {
        name: `screenshot_node_${index + 1}`,
        type,
        x: Math.round(220 + (cluster.x / canvas.width) * 900),
        y: Math.round(100 + (cluster.y / canvas.height) * 1100),
        color: colorForType(type, cluster.color),
        source: tr("视觉块", "Visual block"),
      };
    });
}

function mergeImportCandidates(textCandidates, visualCandidates) {
  if (textCandidates.length && visualCandidates.length) {
    return textCandidates.map((candidate, index) => {
      const visual = visualCandidates[index];
      return {
        ...candidate,
        x: visual?.x ?? candidate.x,
        y: visual?.y ?? candidate.y,
        color: colorForType(candidate.type, visual?.color ?? candidate.color),
        source: tr("OCR + 视觉块", "OCR + visual block"),
      };
    });
  }
  return textCandidates.length ? textCandidates : visualCandidates;
}

function renderCandidates() {
  if (!importCandidates.length) {
    els.candidateList.innerHTML = tr('<div class="empty-state"><strong>暂无候选</strong><span>载入截图或粘贴节点文本。</span></div>', '<div class="empty-state"><strong>No candidates</strong><span>Load a screenshot or paste node text.</span></div>');
    return;
  }
  els.candidateList.innerHTML = importCandidates
    .map(
      (candidate, index) => `
        <label class="candidate-item">
          <span class="category-swatch" style="background:${escapeHtml(candidate.color)}"></span>
          <span class="palette-meta">
            <strong>${escapeHtml(candidate.name)}</strong>
            <small>${escapeHtml(candidate.type)} · ${escapeHtml(candidate.source)}</small>
          </span>
          <input type="checkbox" data-candidate-index="${index}" checked />
        </label>
      `,
    )
    .join("");
}

function applyScreenshotImport() {
  const checked = [...els.candidateList.querySelectorAll("input[type='checkbox']:checked")].map((input) => importCandidates[Number(input.dataset.candidateIndex)]).filter(Boolean);
  if (!checked.length) return;
  const createdIds = [];
  const placement = findImportPlacement(checked.length);
  checked.forEach((candidate, index) => {
    const position = placement[index];
    const node = {
      id: makeId("n"),
      name: uniqueNodeName(candidate.name),
      type: candidate.type,
      group: groupForType(candidate.type),
      ...defaultPortsForType(candidate.type),
      x: position.x,
      y: position.y,
      color: candidate.color,
      note: tr(`来自截图识别: ${candidate.source}`, `Imported from screenshot recognition: ${candidate.source}`),
      vexpression: "",
      noteImages: [],
      params: [["source", "screenshot"]],
    };
    state.nodes.push(node);
    createdIds.push(node.id);
  });

  createdIds.forEach((id, index) => {
    if (!createdIds[index + 1]) return;
    state.connections.push({
      id: makeId("c"),
      from: id,
      to: createdIds[index + 1],
      fromPort: 0,
      toPort: 0,
    });
  });

  setSelectedNodes(createdIds, { primaryId: createdIds[0], render: false });
  selectedConnectionId = null;
  saveState();
  renderAll();
  closeScreenshotModal();
  focusNodes(createdIds, true);
}

function connectionPath(from, to, fromPort = 0, toPort = 0) {
  const start = portWorldPoint(from, "output", fromPort);
  const end = portWorldPoint(to, "input", toPort);
  return connectionPathFromPoints(start, end);
}

function connectionPathFromPoints(start, end) {
  const startX = start.x;
  const startY = start.y;
  const endX = end.x;
  const endY = end.y;
  const distanceY = Math.abs(endY - startY);
  const bend = Math.max(82, Math.min(240, distanceY * 0.48));
  return `M ${startX} ${startY} C ${startX} ${startY + bend}, ${endX} ${endY - bend}, ${endX} ${endY}`;
}

function portWorldPoint(node, direction, portIndex = 0) {
  const count = direction === "input" ? node.inputCount || 1 : node.outputCount || 1;
  return {
    x: node.x + portOffsetX(portIndex, count),
    y: direction === "input" ? node.y : node.y + NODE_HEIGHT,
  };
}

function connectionPoints(from, to, fromPort = 0, toPort = 0, samples = 18) {
  const p0 = portWorldPoint(from, "output", fromPort);
  const p3 = portWorldPoint(to, "input", toPort);
  const distanceY = Math.abs(p3.y - p0.y);
  const bend = Math.max(82, Math.min(240, distanceY * 0.48));
  const p1 = { x: p0.x, y: p0.y + bend };
  const p2 = { x: p3.x, y: p3.y - bend };
  return Array.from({ length: samples + 1 }, (_, index) => cubicPoint(p0, p1, p2, p3, index / samples));
}

function segmentCutsConnection(a, b, from, to, connection) {
  const points = connectionPoints(from, to, connection.fromPort ?? 0, connection.toPort ?? 0);
  for (let index = 0; index < points.length - 1; index += 1) {
    if (segmentsIntersect(a, b, points[index], points[index + 1])) return true;
  }
  return false;
}

function nodeGlyph(type) {
  const lower = String(type).toLowerCase();
  if (lower.includes("wrangle") || lower.includes("attrib")) {
    return '<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h10M5 17h14"/><path d="m16 9 3 3-3 3"/></svg>';
  }
  if (lower.includes("file") || lower.includes("cache")) {
    return '<svg viewBox="0 0 24 24"><path d="M4 7h6l2 2h8v9H4Z"/><path d="M4 10h16"/></svg>';
  }
  if (lower.includes("null") || lower.includes("out")) {
    return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/><path d="M8 12h8"/></svg>';
  }
  if (lower.includes("merge")) {
    return '<svg viewBox="0 0 24 24"><path d="M5 6v5a3 3 0 0 0 3 3h8"/><path d="M5 18v-1a3 3 0 0 1 3-3"/><path d="m15 10 4 4-4 4"/></svg>';
  }
  if (lower.includes("pyro") || lower.includes("solver") || lower.includes("dop")) {
    return '<svg viewBox="0 0 24 24"><path d="M12 20c4-2 6-5 4-9-1 2-3 2-3-1 0-2-1-4-3-5 1 4-4 5-4 10 0 3 2 5 6 5Z"/></svg>';
  }
  if (lower.includes("karma") || lower.includes("render") || lower.includes("rop")) {
    return '<svg viewBox="0 0 24 24"><path d="M5 6h14v12H5Z"/><path d="M8 9h8M8 13h5"/></svg>';
  }
  if (lower.includes("material") || lower.includes("lop")) {
    return '<svg viewBox="0 0 24 24"><path d="M12 4 5 8v8l7 4 7-4V8Z"/><path d="M12 12 5 8M12 12l7-4M12 12v8"/></svg>';
  }
  return '<svg viewBox="0 0 24 24"><path d="M7 5h10l3 7-8 7-8-7Z"/><path d="M7 5l5 14 5-14"/></svg>';
}

function getNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function getActiveBoard(target = state) {
  if (!Array.isArray(target.boards) || !target.boards.length) {
    target.boards = cloneState(DEFAULT_STATE.boards);
    target.activeBoardId = target.boards[0].id;
  }
  return target.boards.find((board) => board.id === target.activeBoardId) ?? target.boards[0];
}

function buildHoudiniNodeLibrary() {
  const seeded = new Map();
  SEEDED_NODE_LIBRARY.forEach((node) => {
    seeded.set(`${node.group}:${normalizeNodeType(node.type)}`, node);
  });

  HOU_CONTEXTS.forEach((context) => {
    (HOU_NODE_INDEX[context.id] || []).forEach((label) => {
      const type = normalizeNodeType(label);
      const key = `${context.id}:${type}`;
      if (seeded.has(key)) return;
      seeded.set(key, {
        type,
        label,
        group: context.id,
        color: context.color,
        params: defaultParamsForContext(context.id, type),
      });
    });
  });

  const order = new Map(HOU_CONTEXTS.map((context, index) => [context.id, index]));
  return [...seeded.values()].sort((a, b) => (order.get(a.group) ?? 99) - (order.get(b.group) ?? 99) || a.label.localeCompare(b.label));
}

function defaultParamsForContext(group, type) {
  const lower = String(type).toLowerCase();
  if (group === "SOP" && lower.includes("file")) return [["file", "$HIP/geo/$OS.bgeo.sc"]];
  if (group === "ROP" || lower.includes("render")) return [["output", "$HIP/render/$OS.$F4.exr"]];
  if (group === "LOP") return [["primpath", "/World/$OS"]];
  if (group === "DOP") return [["substeps", "1"]];
  if (group === "TOP") return [["workitem", "@pdg_index"]];
  return [["context", group]];
}

function defaultPortsForType(type) {
  const lower = normalizeNodeType(type);
  if (lower.includes("merge")) return { inputCount: 4, outputCount: 1, multiInput: true };
  if (lower.includes("switch")) return { inputCount: 4, outputCount: 1, multiInput: false };
  if (lower.includes("blend")) return { inputCount: 2, outputCount: 1, multiInput: false };
  if (lower.includes("boolean")) return { inputCount: 2, outputCount: 1, multiInput: false };
  if (lower.includes("copytopoints") || lower.includes("copyandtransform")) return { inputCount: 2, outputCount: 1, multiInput: false };
  if (lower.includes("solver")) return { inputCount: 2, outputCount: 1, multiInput: false };
  if (lower === "file" || lower.includes("alembic") || lower === "box" || lower === "sphere" || lower === "grid" || lower === "tube") {
    return { inputCount: 0, outputCount: 1, multiInput: false };
  }
  if (lower.includes("null") || lower.includes("out")) return { inputCount: 1, outputCount: 1, multiInput: false };
  return { inputCount: 1, outputCount: 1, multiInput: false };
}

function groupForType(type) {
  const normalized = normalizeNodeType(type);
  const found = NODE_LIBRARY.find((node) => normalizeNodeType(node.type) === normalized || normalizeNodeType(node.label) === normalized);
  return found?.group ?? "SOP";
}

function colorForType(type, fallback) {
  const normalized = normalizeNodeType(type);
  const kind = NODE_LIBRARY.find((item) => normalizeNodeType(item.type) === normalized || normalizeNodeType(item.label) === normalized);
  if (kind) return kind.color;
  if (fallback) return fallback;
  const lower = String(type).toLowerCase();
  if (lower.includes("wrangle") || lower.includes("attrib")) return "#c2572a";
  if (lower.includes("pyro") || lower.includes("solver") || lower.includes("dop")) return "#7c3aed";
  if (lower.includes("render") || lower.includes("karma") || lower.includes("rop") || lower.includes("usd")) return "#d13f34";
  if (lower.includes("material") || lower.includes("lop")) return "#b9822c";
  if (lower.includes("file") || lower.includes("cache")) return "#3b6f9e";
  if (lower.includes("vop") || lower.includes("bind") || lower.includes("fit")) return "#14b8a6";
  if (lower.includes("top") || lower.includes("wedge") || lower.includes("pdg")) return "#22c55e";
  if (lower.includes("cop") || lower.includes("blur") || lower.includes("color")) return "#ec4899";
  if (lower.includes("chop") || lower.includes("channel") || lower.includes("lag")) return "#06b6d4";
  return "#59666f";
}

function guessTypeFromName(name) {
  const lower = String(name).toLowerCase();
  const base = lower.replace(/\d+$/g, "");
  const libraryMatch = NODE_LIBRARY.find((node) => normalizeNodeType(node.type) === normalizeNodeType(base) || normalizeNodeType(node.label) === normalizeNodeType(base));
  if (libraryMatch) return libraryMatch.type;
  if (["box", "sphere", "grid", "tube", "transform", "delete", "smooth", "color", "output", "null"].includes(base)) return base;
  if (lower.includes("wrangle") || lower.includes("attrib")) return "attribwrangle";
  if (lower.includes("mountain")) return "mountain";
  if (lower.includes("merge")) return "merge";
  if (lower.includes("blast")) return "blast";
  if (lower.includes("copy")) return "copytopoints";
  if (lower.includes("pyro") || lower.includes("solver")) return "pyrosolver";
  if (lower.includes("karma") || lower.includes("render")) return "karma";
  if (lower.includes("material")) return "materiallibrary";
  if (lower.includes("null") || lower.includes("out")) return "null";
  if (lower.includes("vop")) return "vopnet";
  if (lower.includes("wedge")) return "wedge";
  if (lower.includes("cop") || lower.includes("blur")) return "blur";
  if (lower.includes("chop") || lower.includes("channel")) return "channel";
  if (lower.includes("file") || lower.includes("cache")) return "file";
  return base || "geo";
}

function guessTypeFromColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "geo";
  if (rgb.r > 150 && rgb.g < 110 && rgb.b < 90) return "attribwrangle";
  if (rgb.b > rgb.r + 35 && rgb.b > rgb.g) return "file";
  if (rgb.r > 115 && rgb.b > 130) return "pyrosolver";
  if (rgb.r > 150 && rgb.g > 110 && rgb.b < 90) return "materiallibrary";
  return "geo";
}

function inferGroupFromCategory(value) {
  const lower = String(value).toLowerCase();
  const groups = ["OBJ", "SOP", "DOP", "VOP", "LOP", "ROP", "CHOP", "COP", "TOP", "APEX"];
  if (lower.includes("vex")) return "VOP";
  return groups.find((group) => lower.includes(group.toLowerCase())) || "";
}

function normalizeNodeType(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function uniqueNodeName(base) {
  const clean = String(base).trim().replace(/\s+/g, "_") || "node";
  const existing = new Set(state.nodes.map((node) => node.name.toLowerCase()));
  if (!existing.has(clean.toLowerCase())) return clean;
  let index = 1;
  while (existing.has(`${clean}_${index}`.toLowerCase())) index += 1;
  return `${clean}_${index}`;
}

function findImportPlacement(count) {
  const existing = state.nodes;
  const startX = existing.length
    ? Math.min(WORLD_WIDTH - NODE_WIDTH - 220, Math.max(...existing.map((node) => node.x)) + IMPORT_NODE_GAP_X)
    : 430;
  const startY = existing.length ? Math.max(90, Math.min(...existing.map((node) => node.y))) : 120;
  const rows = Math.max(1, Math.ceil(Math.sqrt(count)));
  const positions = [];

  for (let column = 0; positions.length < count && column < 12; column += 1) {
    for (let row = 0; positions.length < count && row < rows; row += 1) {
      const candidate = {
        x: clamp(startX + column * IMPORT_NODE_GAP_X, 40, WORLD_WIDTH - NODE_WIDTH - 220),
        y: clamp(startY + row * IMPORT_NODE_GAP_Y, 40, WORLD_HEIGHT - NODE_HEIGHT - 40),
      };
      if (!wouldOverlapExisting(candidate, existing) || column > 3) {
        positions.push(candidate);
      }
    }
  }

  while (positions.length < count) {
    const index = positions.length;
    positions.push({
      x: clamp(startX, 40, WORLD_WIDTH - NODE_WIDTH - 220),
      y: clamp(startY + index * IMPORT_NODE_GAP_Y, 40, WORLD_HEIGHT - NODE_HEIGHT - 40),
    });
  }

  return positions;
}

function wouldOverlapExisting(position, nodes) {
  const padding = 44;
  return nodes.some((node) => {
    const separated =
      position.x + NODE_WIDTH + padding < node.x ||
      node.x + NODE_WIDTH + padding < position.x ||
      position.y + NODE_HEIGHT + padding < node.y ||
      node.y + NODE_HEIGHT + padding < position.y;
    return !separated;
  });
}

function portPositionPercent(index, count) {
  if (count <= 1) return 50;
  return 18 + (64 * index) / (count - 1);
}

function portOffsetX(index, count) {
  return (NODE_WIDTH * portPositionPercent(index, count)) / 100;
}

function viewportPointFromClient(clientX, clientY) {
  const rect = els.graphViewport.getBoundingClientRect();
  return {
    worldX: (clientX - rect.left - viewPan.x) / zoom,
    worldY: (clientY - rect.top - viewPan.y) / zoom,
  };
}

function screenPointFromWorld(worldX, worldY) {
  return {
    x: worldX * zoom + viewPan.x,
    y: worldY * zoom + viewPan.y,
  };
}

function rectContains(outer, inner) {
  return inner.left >= outer.left && inner.right <= outer.right && inner.top >= outer.top && inner.bottom <= outer.bottom;
}

function rectsIntersect(a, b) {
  return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
}

function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function segmentsIntersect(a, b, c, d) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 * o2 <= 0 && o3 * o4 <= 0 && rangesOverlap(a.x, b.x, c.x, d.x) && rangesOverlap(a.y, b.y, c.y, d.y);
}

function orientation(a, b, c) {
  return Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
}

function rangesOverlap(a, b, c, d) {
  return Math.max(Math.min(a, b), Math.min(c, d)) <= Math.min(Math.max(a, b), Math.max(c, d)) + 0.001;
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, Math.trunc(Number(value) || 0)));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "board";
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => clamp(value, 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
