(function () {
    Graph = function (Re, Im, scaler, maxh, maxv, step, res) {
        let container = document.getElementById('container');
        let scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        var camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -2, 99999);
        camera.position.set(0, 30, 0);

        let frustumSize = 69;

        let axes = [0x50514f, 0x70c1b3, 0xed6a5a];
        let colors = [
            0xf77272, 0xf7a472, 0xf7d672, 0xe6f772, 0xb5f772, 0x83f772,
            0x72f793, 0x72f7c5, 0x72f7f7, 0x72c5f7, 0x7293f7, 0x8372f7,
            0xb572f7, 0xe672f7, 0xf772d6, 0xf772a4,
        ];
        this.colorSet = colors;
        let rot = 0;
        let neg = 1;
        let swop = false;

        let max = maxh;

        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        let clock = new THREE.Clock();
        let resolution = new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        );
        let graph = new THREE.Object3D();
        scene.add(graph);

        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.font = 'Cambria 16px';
        this.hina = function () {
            if (rot == 0.25) {
                rot = 0;
            } else {
                rot = 0.25;
                camera.position.set(0, 0, 30);
                if (graph.rotation.x == 0) {
                    graph.rotation.x = 0.4;
                    graph.rotation.y = 0;
                    graph.rotation.z = 0;
                }

                camera.rotation.z = 180;
            }
        };
        this.showRe = function () {
            rot = 0;
            camera.position.set(0, 30, 0);
            graph.rotation.x = 0;
            graph.rotation.y = 3.14159;
            graph.rotation.z = 0;
        };
        this.showIm = function () {
            rot = 0;
            camera.position.set(0, 0, 30);
            graph.rotation.x = 0;
            graph.rotation.y = 0;
            graph.rotation.z = 0;

            camera.rotation.z = 180;
        };
        this.ReIm = function () {
            rot = 0;
            camera.position.set(30, 0, 0);
            graph.rotation.x = 0;
            graph.rotation.y = 0;
            graph.rotation.z = 0;

            camera.rotation.z = 180;
        };
        this.nega = function () {
            clearGraph();
            neg *= -1;
            init();
            clearCanvas();
            draw2DAxes();
            drawLines();
        };
        this.swap = function () {
            clearGraph();
            swop = !swop;
            if (swop) max = maxv;
            else max = maxh;
            console.log(max);
            init();
            clearCanvas();
            draw2DAxes();
            drawLines();
        };
        function clearGraph() {
            for (var i = graph.children.length - 1; i >= 0; i--) {
                graph.remove(graph.children[i]);
            }
        }
        max;
        init();
        render();
        this.showRe();
        draw2DAxes();
        drawLines();
        function createLines() {
            let i = 0;
            for (let b = 0; b <= max; b += step) {
                var line = new THREE.Geometry();
                var line = new Float32Array(200 * res);
                for (var j = 0; j < 200 * res; j += 3) {
                    a = j / ((50 / 3) * res) - 6;
                    line[j] = a;
                    if (swop) {
                        let im = Im(b, a * neg) / scaler.vert;
                        let re = Re(b, a * neg) / scaler.vert;
                        if (Math.abs(im) < 30 && Math.abs(re) < 30) {
                            line[j + 1] = im;
                            line[j + 2] = re;
                        }
                    } else {
                        let re = Re(a * neg, b) / scaler.horz;
                        let im = Im(a * neg, b) / scaler.horz;
                        if (Math.abs(re) < 30 && Math.abs(re) < 30) {
                            line[j + 1] = im;
                            line[j + 2] = re;
                        }
                    }
                }

                makeLine(line, 0);
                makeLine(line, colors[i % 16]); // a+bi, where a is the x axis and b = 2
                i++;
            }
        }
        function createAxes() {
            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(-30, 0, 0));
            line.vertices.push(new THREE.Vector3(30, 0, 0));
            makeLine(line, axes[0]); // x

            // x-arrow
            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(29, 0, 1));
            line.vertices.push(new THREE.Vector3(30, 0, 0));
            makeLine(line, axes[0]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(29, 1, 0));
            line.vertices.push(new THREE.Vector3(30, 0, 0));
            makeLine(line, axes[0]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(29, 0, -1));
            line.vertices.push(new THREE.Vector3(30, 0, 0));
            makeLine(line, axes[0]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(29, -1, 0));
            line.vertices.push(new THREE.Vector3(30, 0, 0));
            makeLine(line, axes[0]);

            // y-arrow
            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, 29, 1));
            line.vertices.push(new THREE.Vector3(0, 30, 0));
            makeLine(line, axes[1]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, 29, -1));
            line.vertices.push(new THREE.Vector3(0, 30, 0));
            makeLine(line, axes[1]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(1, 29, 0));
            line.vertices.push(new THREE.Vector3(0, 30, 0));
            makeLine(line, axes[1]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(-1, 29, 0));
            line.vertices.push(new THREE.Vector3(0, 30, 0));
            makeLine(line, axes[1]);

            // z-arrow
            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(1, 0, 29));
            line.vertices.push(new THREE.Vector3(0, 0, 30));
            makeLine(line, axes[2]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(-1, 0, 29));
            line.vertices.push(new THREE.Vector3(0, 0, 30));
            makeLine(line, axes[2]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, 1, 29));
            line.vertices.push(new THREE.Vector3(0, 0, 30));
            makeLine(line, axes[2]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, -1, 29));
            line.vertices.push(new THREE.Vector3(0, 0, 30));
            makeLine(line, axes[2]);

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, -30, 0));
            line.vertices.push(new THREE.Vector3(0, 30, 0));
            makeLine(line, axes[1]); // y

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(0, 0, -30));
            line.vertices.push(new THREE.Vector3(0, 0, 30));
            makeLine(line, axes[2]); // z
        }
        function makeLine(geo, c) {
            var g = new MeshLine();
            g.setGeometry(geo);

            var material = new MeshLineMaterial({
                useMap: false,
                color: new THREE.Color(c),
                opacity: 1,
                resolution: resolution,
                sizeAttenuation: false,
                lineWidth: 10,
            });
            var mesh = new THREE.Mesh(g.geometry, material);
            graph.add(mesh);
        }
        function createText() {
            const loader = new THREE.FontLoader();

            loader.load('fonts/CMU.json', function (font) {
                let options = {
                    font: font,
                    size: 3,
                    height: 0,
                    curveSegments: 12,
                    bevelEnabled: false,
                };
                let xlabel = new THREE.TextGeometry('x', options);
                materials = [
                    new THREE.MeshPhongMaterial({
                        color: null,
                        flatShading: true,
                    }), // front
                    new THREE.MeshPhongMaterial({ color: null }), // side
                ];
                let xMesh = new THREE.Mesh(xlabel, materials);
                xMesh.position.x = 30;
                xMesh.rotation.x = 3.14159 / 2;

                graph.add(xMesh);

                let Imlabel = new THREE.TextGeometry('Im', options);
                materials = [
                    new THREE.MeshPhongMaterial({
                        color: null,
                        flatShading: true,
                    }), // front
                    new THREE.MeshPhongMaterial({ color: null }), // side
                ];

                let ImMesh = new THREE.Mesh(Imlabel, materials);
                ImMesh.position.y = 30;
                graph.add(ImMesh);

                let Relabel = new THREE.TextGeometry('Re', options);
                materials = [
                    new THREE.MeshPhongMaterial({
                        color: null,
                        flatShading: true,
                    }), // front
                    new THREE.MeshPhongMaterial({ color: null }), // side
                ];
                let ReMesh = new THREE.Mesh(Relabel, materials);
                ReMesh.position.z = 30;
                ReMesh.rotation.x = 3.14159 / 2;
                ReMesh.rotation.y = 3.14159;

                graph.add(ReMesh);
            });
        }
        function init() {
            createAxes();

            createLines();
            createText();
        }
        onWindowResize();
        function onWindowResize() {
            var w = container.clientWidth;
            var h = container.clientHeight;

            var aspect = w / h;

            camera.left = (-frustumSize * aspect) / 2;
            camera.right = (frustumSize * aspect) / 2;
            camera.top = frustumSize / 2;
            camera.bottom = -frustumSize / 2;

            camera.updateProjectionMatrix();

            renderer.setSize(w, h);

            resolution.set(w, h);
        }
        window.addEventListener('resize', onWindowResize);
        function render() {
            requestAnimationFrame(render);
            controls.update();
            graph.rotation.y += rot * clock.getDelta();

            renderer.render(scene, camera);
        }
        function draw2DAxes() {
            ctx.strokeStyle = '#eef5db';
            ctx.beginPath();

            let width = canvas.width;
            let height = canvas.height;

            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.stroke();

            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2 - 5, 5);
            ctx.stroke();

            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2 + 5, 5);
            ctx.stroke();

            ctx.moveTo(0, height / 2);
            ctx.lineTo(height, height / 2);
            ctx.stroke();

            ctx.moveTo(width, height / 2);
            ctx.lineTo(width - 5, height / 2 - 5);
            ctx.stroke();

            ctx.moveTo(width, height / 2);
            ctx.lineTo(width - 5, height / 2 + 5);
            ctx.stroke();

            ctx.fillStyle = '#eef5db';
            ctx.fillText('Im', width / 2 + 5, 16);
            ctx.fillText('Re', width - 20, height / 2 - 5);
        }
        function drawLines() {
            for (let i = 0; i < colors.length; i++) {
                ctx.strokeStyle = '#' + colors[i].toString(16);
                ctx.beginPath();

                let height = canvas.height;
                let offset = i * 10 * neg;
                let width = canvas.width;
                if (swop) {
                    ctx.moveTo(width / 2 + offset, 0);
                    ctx.lineTo(width / 2 + offset, height);
                    ctx.stroke();
                } else {
                    ctx.moveTo(0, height / 2 - offset);
                    ctx.lineTo(height, height / 2 - offset);
                    ctx.stroke();
                }
            }
        }
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
})();
