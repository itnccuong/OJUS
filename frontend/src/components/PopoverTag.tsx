import { Popover, OverlayTrigger } from "react-bootstrap";

const TagsPopover = ({ tags }: { tags: string[] }) => {
  const popoverTag = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Topics</Popover.Header>
      <Popover.Body>
        <div className="mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="badge rounded-pill bg-body-secondary text-dark m-1 mx-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="hover" placement="right" overlay={popoverTag}>
      <span className="badge bg-body-secondary text-dark">Topics</span>
    </OverlayTrigger>
  );
};

export default TagsPopover;
