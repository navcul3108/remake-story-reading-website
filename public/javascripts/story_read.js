$("#pdf-viewer").kendoPDFViewer({
    pdfjsProcessing: {
        file: $("#link-to-pdf").text()
    },
    toolbar: {
        items: ["pager","spacer","zoom","toggleSelection","spacer","search"]
    }
})