/* globals Vue, marked, fetch, window, document */

// TOC components

Vue.component('toc-class-member', {
	props: {
		data: Object,
		parent: Object,
	},
	template: `
		<div class="constructor-signatures" v-if="data.kindString === 'Constructor' || data.kindString === 'Method'">
			<!-- div inside ul? why i never -->
			<li
				v-for="signature in data.signatures"
				:key="'toc' + signature.id"
			>
				<a :href="$root.hrefForThing(signature)">
					{{signature.name}}({{$root.paramList(signature.parameters)}})
				</a>
			</li>
		</div>
		<li v-else-if="data.kindString === 'Property'">
			<a :href="$root.hrefForThingProperties(parent)">
				Properties
			</a>
		</li>
	`,
});

Vue.component('toc-entry', {
	props: {
		data: Object,
	},
	computed: {
		filteredChildren () {
			return this.$root.filterChildren(this.data.children);
		},
	},
	template: `
		<li>
			<a :href="$root.hrefForThing(data)">
				{{data.kindString}}: <code>{{data.name}}</code>
			</a>
			<ul v-if="data.children && data.children.length">
				<toc-class-member
					v-for="member in filteredChildren"
					:key="'toc' + member.id"
					:data="member"
					:parent="data"
				/>
			</ul>
		</li>
	`,
});

Vue.component('toc-sidebar', {
	props: {
		things: Array,
		sections: Array,
		versions: Array,
		selectedVersion: String,
	},
	template: `
		<aside class="toc">
			<div class="version-select">
				Docs version:
				<select
					:value="selectedVersion"
					@input="$emit('change', $event.target.value)"
				>
					<option
						v-for="version in versions"
						:key="version"
						:value="version"
					>
						{{$root.nameForVersion(version)}}
					</option>
				</select>
			</div>
			<ul>
				<toc-entry
					v-for="data in things"
					:key="'toc' + data.id"
					:data="data"
				/>
			</ul>
		</aside>
	`,
});

// Main content components

Vue.component('type-render', {
	props: {
		type: Object,
	},
	methods: {
		stringify: JSON.stringify,
	},
	template: `
		<span v-if="type.type === 'union'">
			<template v-for="(childType, i) in type.types">
				{{i ? '|' : ''}}
				<type-render :type="childType"/>
			</template>
		</span>
		<span v-else-if="type.type === 'reference'">
			<a v-if="type.id" :href="$root.hrefForThing(type)">
				{{type.name}}
			</a>
			<span v-else>{{type.name}}</span>
		</span>
		<span v-else-if="type.type === 'intrinsic'">{{type.name}}</span>
		<span v-else-if="type.type === 'array'">
			<type-render :type="type.elementType"/>[]
		</span>
		<span v-else>
			{{stringify(type)}}
		</span>
	`,
});

Vue.component('thing-display', {
	props: {
		data: Object,
	},
	computed: {
		filteredChildren () {
			return this.$root.filterChildren(this.data.children);
		},
		allProperties () {
			return this.data.children.filter(child => {
				if (child.kindString !== 'Property') return false;
				if (child.flags && child.flags.isPrivate) return false;
				if (child.inheritedFrom) return this.$root.showInherited;
				return true;
			});
		},
	},
	methods: {
		marked,
	},
	template: `
		<div :id="$root.idForThing(data)">
			<h1>
				{{data.kindString}} <code>{{data.name}}</code>
				<small v-if="data.extendedTypes && data.extendedTypes.length">
					extends
					<template v-for="(type, i) in data.extendedTypes">
						{{i ? ', ' : ''}}
						<a v-if="type.id" :href="$root.hrefForThing(type)">
							<code>{{type.name}}</code>
						</a>
						<code v-else>Eris.{{type.name}}</code>
					</template>
				</small>
			</h1>
			<p v-html="$root.renderComment(data.comment)" />
			<template v-for="child in this.filteredChildren">
				<template v-if="child.kindString === 'Property'">
					<h2 :id="$root.idForThingProperties(data)">
						Properties
					</h2>
					<table>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
						<tr v-for="property in allProperties">
							<td>
								<code>{{property.name}}</code>
							</td>
							<td>
								<type-render :type="property.type"/>
							</td>
							<td v-html="$root.renderComment(property.comment)" />
						</tr>
					</table>
				</template>
				<template v-if="child.kindString === 'Constructor' || child.kindString === 'Method'">
					<template v-for="signature in child.signatures">
						<!-- TODO: duplicate signature handling code needs to be broken out -->
						<h2 :id="$root.idForThing(signature)">
							{{child.kindString}}: <code>{{signature.name}}({{$root.paramList(signature.parameters)}})</code>
						</h2>
						<p v-html="$root.renderComment(signature.comment)" />
						<table>
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Description</th>
							</tr>
							<tr v-for="param in signature.parameters">
								<td>
									<code>{{param.name}}</code>
								</td>
								<td>
									<type-render :type="param.type"/>
								</td>
								<td></td>
							</tr>
						</table>
					</template>
				</template>
			</template>
			<template v-if="data.signatures" v-for="signature in data.signatures">
				test
				<!-- TODO: duplicate signature handling code needs to be broken out -->
				<h2 :id="$root.idForThing(signature)">
					{{signature.kindString}}: <code>({{$root.paramList(signature.parameters)}})</code>
				</h2>
				<p v-html="$root.renderComment(signature.comment)" />
				<table>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
					<tr v-for="param in signature.parameters">
						<td>
							<code>{{param.name}}</code>
						</td>
						<td>
							<type-render :type="param.type"/>
						</td>
						<td></td>
					</tr>
				</table>
			</template>
		</div>
	`,
});

// Vue initialization

Vue.component('docs-main', {
	props: {
		things: Array,
	},
	template: `
		<main>
			<template v-for="thing in things">
				<thing-display :data="thing"/>
				<hr/>
			</template>
			<small>Docs generated by Vue! Woo!</small>
		</main>
	`,
});

new Vue({ // eslint-disable-line no-new
	data () {
		return {
			data: null,
			showInherited: false,
			versions: [],
			selectedVersion: null
		};
	},
	created () {
		fetch('../versions.txt').then(response => response.text()).then(data => {
			this.versions = data.split('\n').filter(s => s);
			if (window.location.search) {
				// debugger;
				const version = this.versionForName(window.location.search.substring(1))
				if (version) this.selectedVersion = version;
			}
			if (!this.versions.includes(this.selectedVersion)) {
				this.selectedVersion = this.versions[this.versions.length - 1];
			}
		});
	},
	methods: {
		idForThing (thing) {
			return `${thing.id}-${thing.name}`.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
		},
		idForThingProperties (thing) {
			return `${this.idForThing(thing)}-properties`;
		},
		hrefForThing (thing) {
			return `?${this.$root.nameForVersion(this.$root.selectedVersion)}#${this.idForThing(thing)}`;
		},
		hrefForThingProperties (thing) {
			return `?${this.$root.nameForVersion(this.$root.selectedVersion)}${this.hrefForThing(thing)}-properties`;
		},
		paramList (parameters) {
			return parameters ? parameters.map(param => param.name).join(', ') : '';
		},
		filterChildren (children) {
			if (!children) return [];
			let hasProperties = false;
			return children.filter(thing => {
				if (thing.kindString === 'Property') {
					// just trust me on this one
					// eslint-disable-next-line no-return-assign
					return hasProperties ? false : hasProperties = true;
				}
				if (thing.flags && thing.flags.isPrivate) return false;
				if (thing.inheritedFrom) return this.showInherited;
				return true;
			});
		},
		renderComment (comment) {
			if (!comment) return '';
			if (!comment.shortText) return '';
			return marked(comment.shortText);
		},
		versionForName (name) {
			const version = `/versions/${name}.json`;
			return version;
		},
		nameForVersion (version) {
			if (!version) return '<unknown>';
			return version.replace(/^\/versions\/|\.json$/g, '');
		},
	},
	computed: {
		modules () {
			return this.data && this.data.children;
		},
		classes () {
			if (!this.modules) return undefined;
			let children = [];
			this.modules.forEach(m => {
				m.children && m.children.forEach(child => {
					if (!['Type alias', 'Object literal', 'Function'].includes(child.kindString)) children.push(child);
				});
			});
			return children;
		},
	},
	watch: {
		selectedVersion (version) {
			fetch('..' + version).then(response => response.json()).then(data => {
				this.data = data;
			});
		}
	},
	template: `
		<div class="docs-root">
			<div v-if="!data">Loading...</div>
			<template v-else>
				<toc-sidebar
					:things="classes"
					:versions="versions"
					:selectedVersion="selectedVersion"
					@change="selectedVersion = $event"
				/>
				<docs-main :things="classes"/>
			</template>
		</div>
	`,
	el: '#app',
	mounted () {
		// wack
		setTimeout(() => {
			if (window.location.hash) {
				const id = window.location.hash.substring(1);
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView();
				}
			}
		}, 500);
	},
});
